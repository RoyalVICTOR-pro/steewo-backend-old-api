import { UserCreateDTO } from '@DTO/UserCreateDTO'
import User from 'App/Models/User'

export default interface AuthServiceContract {
  createUserAccount(data: UserCreateDTO): Promise<User>
}
