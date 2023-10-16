import { inject } from '@adonisjs/core/build/standalone'
import User from 'App/Models/User'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import UserInterface from 'App/DataAccessLayer/Interfaces/UserInterface'

@inject()
export class UserRepository implements UserInterface {
  public async createUser(data: UserCreateDTO): Promise<User> {
    const user = new User()
    user.email = data.email
    user.password = data.password
    user.user_language = data.user_language
    user.internal_or_sso = data.internal_or_sso
    await user.save()
    return user
  }
}
