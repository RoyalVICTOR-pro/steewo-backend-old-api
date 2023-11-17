import { UserCreateDTO } from '@DTO/UserCreateDTO'
import User from '@Models/User'

export default interface AuthServiceInterface {
  createUserAccount(data: UserCreateDTO): Promise<User>
}
