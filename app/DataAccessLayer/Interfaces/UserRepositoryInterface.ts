// DTO
import UserCreateDTO from '@DTO/UserCreateDTO'
import UserUpdateDTO from '@DTO/UserUpdateDTO'
// MODELS
import User from '@Models/User'

export default interface UserRepositoryInterface {
  createUser(data: UserCreateDTO): Promise<User>
  getUserByEmail(email: string): Promise<User | null>
  getUserById(id: number): Promise<User | null>
  updateUserData(user: User, data: UserUpdateDTO): Promise<User>
}
