import User from '@Models/User'
import { UserCreateDTO } from '@DTO/UserCreateDTO'

export default interface UserRepositoryInterface {
  createUser(data: UserCreateDTO): Promise<User>
  getUserByEmail(email: string): Promise<User | null>
}
