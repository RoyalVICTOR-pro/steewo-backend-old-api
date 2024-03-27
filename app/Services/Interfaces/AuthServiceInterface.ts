// ADONIS
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
// DTO
import UserCreateDTO from '@DTO/UserCreateDTO'
// MODELS
import User from '@Models/User'

export default interface AuthServiceInterface {
  createUserAccount(data: UserCreateDTO): Promise<User>
  authenticateUser(
    loginData: any,
    auth: AuthContract
  ): Promise<{ token: string; user: User } | false>
  getAuthenticatedUser(auth: AuthContract): Promise<User>
  logoutUser(auth: AuthContract): Promise<void>
}
