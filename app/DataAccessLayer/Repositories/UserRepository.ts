import { inject } from '@adonisjs/core/build/standalone'
import User from '@Models/User'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import UserRepositoryInterface from '@DALInterfaces/UserRepositoryInterface'
import { UserUpdateDTO } from '../DTO/UserUpdateDTO'
import { DateTime } from 'luxon'

@inject()
export class UserRepository implements UserRepositoryInterface {
  public async createUser(data: UserCreateDTO): Promise<User> {
    const user = new User()
    user.email = data.email
    user.password = data.password
    user.user_language = data.user_language
    user.internal_or_sso = data.internal_or_sso
    await user.save()
    return user
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const user = await User.findBy('email', email)
    return user
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await User.find(id)
    return user
  }

  public async updateUserData(user: User, data: UserUpdateDTO): Promise<User> {
    if (data.privacy_acceptation) {
      user.privacy_acceptation = data.privacy_acceptation
    }
    if (data.cgv_acceptation) {
      user.cgv_acceptation = data.cgv_acceptation
    }
    if (data.is_valid_email) {
      user.is_valid_email = data.is_valid_email
    }
    if (data.has_enabled_notifications) {
      user.has_enabled_notifications = data.has_enabled_notifications
    }
    await user.save()
    return user
  }
}
