import { inject } from '@adonisjs/core/build/standalone'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import Config from '@ioc:Adonis/Core/Config'
import AuthServiceInterface from 'App/Services/Interfaces/AuthServiceInterface'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'

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
}
