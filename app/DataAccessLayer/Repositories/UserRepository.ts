import { inject } from '@adonisjs/core/build/standalone'
import User from '@Models/User'
import UserCreateDTO from '@DTO/UserCreateDTO'
import UserRepositoryInterface from '@DALInterfaces/UserRepositoryInterface'
import UserUpdateDTO from '@DTO/UserUpdateDTO'
import UserUpdatePasswordDTO from '@DTO/UserUpdatePasswordDTO'

@inject()
export default class UserRepository implements UserRepositoryInterface {
  public async createUser(data: UserCreateDTO): Promise<User> {
    const user = new User()
    user.merge(data)
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
    user.merge(data)
    await user.save()
    return user
  }

  public async updateUserPassword(user: User, data: UserUpdatePasswordDTO): Promise<User> {
    user.merge(data)
    await user.save()
    return user
  }
}
