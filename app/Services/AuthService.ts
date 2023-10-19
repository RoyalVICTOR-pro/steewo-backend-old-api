import { FailedLoginAttemptRepository } from 'App/DataAccessLayer/Repositories/FailedLoginAttemptRepository'
import { inject } from '@adonisjs/core/build/standalone'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import Config from '@ioc:Adonis/Core/Config'
import AuthServiceInterface from 'App/Services/Interfaces/AuthServiceInterface'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
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

    // TODO: Récupérer ici les nom et prénom de l'utilisateur en fonction de son role et les ajouter à la réponse

    const userInfo = {
      email: user.email,
      role: user.role,
      status: user.status,
      user_language: user.user_language,
    }
    const token = response.token
    return { token, userInfo }
  }
}
