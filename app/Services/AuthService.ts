import { UserCreateDTO } from '@DTO/UserCreateDTO'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
import Config from '@ioc:Adonis/Core/Config'

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public async createUserAccount(data: UserCreateDTO) {
    if (!data.user_language) data.user_language = Config.get('custom.DEFAULT_LANGUAGE')
    return this.userRepository.createUser(data)
  }
}
