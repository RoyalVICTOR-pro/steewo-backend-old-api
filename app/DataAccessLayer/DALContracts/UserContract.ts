import User from 'App/Models/User'
import UserCreateDTO from '@DTO/UserCreateDTO'

export default interface UserContract {
  createUser(data: UserCreateDTO): Promise<User>
}
