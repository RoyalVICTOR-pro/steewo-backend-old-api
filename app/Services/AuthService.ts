import { inject } from '@adonisjs/fold'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import UserContract from 'App/DataAccessLayer/DALContracts/UserContract'
import Config from '@ioc:Adonis/Core/Config'
import AuthServiceContract from 'App/Services/ServicesContracts/AuthServiceContract'

@inject()
export class AuthService implements AuthServiceContract {
  constructor(private userRepository: UserContract) {}

  public async createUserAccount(data: UserCreateDTO) {
    if (!data.user_language) data.user_language = Config.get('custom.DEFAULT_LANGUAGE')
    return this.userRepository.createUser(data)
  }
}
