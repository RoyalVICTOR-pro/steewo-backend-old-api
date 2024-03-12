import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from '@Models/User'
import UserCreateDTO from '@DTO/UserCreateDTO'

export default interface AuthServiceInterface {
  createUserAccount(data: UserCreateDTO): Promise<User>
  authenticateUser(
    loginData: any,
    auth: AuthContract
  ): Promise<{ token: string; user: User } | false>
  getAuthenticatedUser(auth: AuthContract): Promise<User>
  logoutUser(auth: AuthContract): Promise<void>
}
