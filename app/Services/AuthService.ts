import { FailedLoginAttemptRepository } from '@DALRepositories/FailedLoginAttemptRepository'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import Config from '@ioc:Adonis/Core/Config'
import AuthServiceInterface from '@Services/Interfaces/AuthServiceInterface'
import { UserRepository } from '@DALRepositories/UserRepository'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import TooManyRequestsException from 'App/Exceptions/TooManyRequestsException'

@inject()
export class AuthService implements AuthServiceInterface {
  private userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  public async createUserAccount(data: UserCreateDTO) {
    if (!data.user_language) data.user_language = Config.get('custom.DEFAULT_LANGUAGE')
    return this.userRepository.createUser(data)
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

    const response = await auth.attempt(loginData.email, loginData.password)

    if (!response) {
      await failedLoginAttemptRepository.addFailedAttempt(loginData.email)
      return false
    }

    const responseData = {
      token: response.token,
      user: user,
    }

    return responseData
  }

  public async getAuthenticatedUser(auth: AuthContract) {
    try {
      const user = await auth.authenticate()
      return user
    } catch (error) {
      // console.log('error :>> ', error)
      throw new Exception(error.message, error.status, error.code)
    }
  }

  public async logoutUser(auth: AuthContract) {
    await auth.logout()
  }
}
