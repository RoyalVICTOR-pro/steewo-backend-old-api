import { inject } from '@adonisjs/fold'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import Config from '@ioc:Adonis/Core/Config'
import AuthServiceInterface from 'App/Services/Interfaces/AuthServiceInterface'
import UserInterface from 'App/DataAccessLayer/Interfaces/UserInterface'

@inject()
export class AuthService implements AuthServiceInterface {
  constructor(private userRepository: UserInterface) {}

  public async createUserAccount(data: UserCreateDTO) {
    if (!data.user_language) data.user_language = Config.get('custom.DEFAULT_LANGUAGE')
    return this.userRepository.createUser(data)
  }
}
