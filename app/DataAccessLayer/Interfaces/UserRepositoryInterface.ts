import User from 'App/Models/User'
import { UserCreateDTO } from '@DTO/UserCreateDTO'

export default interface UserRepositoryInterface {
  createUser(data: UserCreateDTO): Promise<User>
}
