// ADONIS
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
// DTO
import UserCreateDTO from '@DTO/UserCreateDTO'
// MODELS
import User from '@Models/User'

export default interface AuthServiceInterface {
  createUserAccount(data: UserCreateDTO): Promise<User>
  validateEmail(token: string, email: string): Promise<User>
  authenticateUser(
    loginData: any,
    auth: AuthContract
  ): Promise<{ token: string; user: User } | false>
  getAuthenticatedUser(auth: AuthContract): Promise<User>
  forgotPassword(email: string): Promise<User | undefined>
  resetPassword(token: string, email: string, newPassword: string): Promise<User>
  logoutUser(auth: AuthContract): Promise<void>
}
