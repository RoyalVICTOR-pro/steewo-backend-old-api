// ADONIS
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { DateTime } from 'luxon'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import { v4 as uuidv4 } from 'uuid'
import Config from '@ioc:Adonis/Core/Config'
// DTO
import UserCreateDTO from '@DTO/UserCreateDTO'
import UserUpdateDTO from '@DTO/UserUpdateDTO'
import UserUpdatePasswordDTO from '@DTO/UserUpdatePasswordDTO'
// ENUMS
import UserStatus from '@Enums/UserStatus'
import Role from '@Enums/Roles'
// EXCEPTIONS
import TooManyRequestsException from '@Exceptions/TooManyRequestsException'
// INTERFACES
import AuthServiceInterface from '@Services/Interfaces/AuthServiceInterface'
// MODELS
import ApiToken from '@Models/ApiToken'
import User from '@Models/User'
// REPOSITORIES
import FailedLoginAttemptRepository from '@DALRepositories/FailedLoginAttemptRepository'
import UserRepository from '@DALRepositories/UserRepository'
// SERVICES
import MailService from '@Services/MailService'

@inject()
export default class AuthService implements AuthServiceInterface {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  public async createUserAccount(data: UserCreateDTO) {
    const verificationToken = uuidv4()

    data.email_validation_token = verificationToken
    if (!data.user_language) data.user_language = Config.get('custom.DEFAULT_LANGUAGE')
    if (!data.status) data.status = UserStatus.EMAIL_REGISTERED
    return this.userRepository.createUser(data)
  }

  public async validateEmail(token: string, email: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }
    if (user.email_validation_token !== token) {
      throw new Exception('Invalid token', 401, 'E_UNAUTHORIZED')
    }
    const userDataToUpdate: UserUpdateDTO = {
      email_validation_token: null,
      is_valid_email: true,
    }
    return this.userRepository.updateUserData(user, userDataToUpdate)
  }

  public async authenticateUser(loginData: any, auth: AuthContract) {
    const failedLoginAttemptRepository = new FailedLoginAttemptRepository()
    if (await failedLoginAttemptRepository.hasTooManyAttempts(loginData.email)) {
      throw new TooManyRequestsException()
    }

    const user = await this.userRepository.getUserByEmail(loginData.email)

    if (!user) {
      await failedLoginAttemptRepository.addFailedAttempt(loginData.email)
      return false
    }

    let expirationPeriod = Config.get('custom.DEFAULT_TOKEN_DURATION')
    if (loginData.remember_me) {
      expirationPeriod = Config.get('custom.REMEMBER_ME_TOKEN_DURATION')
    }

    try {
      const response = await auth.attempt(loginData.email, loginData.password, {
        expiresIn: expirationPeriod,
      })
      const responseData = {
        token: response.token,
        user: user,
      }

      return responseData
    } catch (error) {
      await failedLoginAttemptRepository.addFailedAttempt(loginData.email)
      return false
    }
  }

  public async getAuthenticatedUser(auth: AuthContract) {
    try {
      const user = await auth.authenticate()
      return user
    } catch (error) {
      throw new Exception(error.message, error.status, error.code)
    }
  }

  public async forgotPassword(email: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      // For security reasons, we don't want to reveal if the email exists or not
      console.log("le user n'a pas été trouvé")
      return
    }
    const passwordResetToken = uuidv4()
    const passwordResetTokenExpiration = DateTime.now().plus({ minutes: 15 })
    const userDataToUpdate: UserUpdateDTO = {
      password_reset_token: passwordResetToken,
      password_reset_token_expiration_datetime: passwordResetTokenExpiration,
    }

    await MailService.sendForgotPasswordMail(email, passwordResetToken)

    return this.userRepository.updateUserData(user, userDataToUpdate)
  }

  public async resetPassword(token: string, email: string, newPassword: string) {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }
    if (user.password_reset_token !== token) {
      throw new Exception('Invalid token', 401, 'E_UNAUTHORIZED')
    }
    if (
      user.password_reset_token_expiration_datetime &&
      user.password_reset_token_expiration_datetime < DateTime.now()
    ) {
      throw new Exception('Token expired', 401, 'E_UNAUTHORIZED')
    }
    const userDataToUpdate: UserUpdatePasswordDTO = {
      password_reset_token: null,
      password_reset_token_expiration_datetime: null,
      password: newPassword,
    }
    await this.deleteAllApiTokens(user)
    return this.userRepository.updateUserPassword(user, userDataToUpdate)
  }

  private async deleteAllApiTokens(user: User) {
    await ApiToken.query().where('user_id', user.id).delete()
  }

  public async logoutUser(auth: AuthContract) {
    await auth.logout()
  }

  public static async getRoleByAuth(auth: AuthContract): Promise<Role> {
    if (auth.user!.role) {
      return auth.user!.role
    }
    const user = await User.query().where('id', auth.user!.id).firstOrFail()
    return user.role
  }
}
