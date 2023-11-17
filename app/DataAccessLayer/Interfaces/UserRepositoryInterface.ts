import User from '@Models/User'
import { UserCreateDTO } from '@DTO/UserCreateDTO'

export default interface UserRepositoryInterface {
  createUser(data: UserCreateDTO): Promise<User>
}
