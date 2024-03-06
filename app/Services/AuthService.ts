import { FailedLoginAttemptRepository } from '@DALRepositories/FailedLoginAttemptRepository'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import Config from '@ioc:Adonis/Core/Config'
import AuthServiceInterface from '@Services/Interfaces/AuthServiceInterface'
import { UserRepository } from '@DALRepositories/UserRepository'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import TooManyRequestsException from 'App/Exceptions/TooManyRequestsException'
import { v4 as uuidv4 } from 'uuid'
import { UserUpdateDTO } from '@DTO/UserUpdateDTO'
import { UserUpdatePasswordDTO } from '@DTO/UserUpdatePasswordDTO'
import { DateTime } from 'luxon'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import ApiToken from 'App/Models/ApiToken'

@inject()
export class AuthService implements AuthServiceInterface {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  public async createUserAccount(data: UserCreateDTO) {
    const verificationToken = uuidv4()

    data.email_validation_token = verificationToken
    if (!data.user_language) data.user_language = Config.get('custom.DEFAULT_LANGUAGE')
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

    let expirationPeriod = '1d'
    if (loginData.remember_me) {
      expirationPeriod = '15d'
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

    const sendEmail = Env.get('SEND_EMAIL')
    if (sendEmail === 'true') {
      await Mail.send((message) => {
        message
          .from('no-reply@steewo.io')
          .to(email)
          .subject('Steewo - Modifiez votre mot de passe')
          .htmlView('emails/password_reset', {
            token: passwordResetToken,
            email: email,
          })
      })
    }
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
}
