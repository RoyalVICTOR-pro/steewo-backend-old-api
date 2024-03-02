import User from '@Models/User'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import { UserUpdateDTO } from '@DTO/UserUpdateDTO'

export default interface UserRepositoryInterface {
  createUser(data: UserCreateDTO): Promise<User>
  getUserByEmail(email: string): Promise<User | null>
  updateUserById(id: number, data: UserUpdateDTO): Promise<User>
}
