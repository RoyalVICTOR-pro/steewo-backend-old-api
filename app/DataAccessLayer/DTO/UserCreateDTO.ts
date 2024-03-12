import AuthentificationMode from '@Enums/AuthentificationMode'
import UserStatus from '@Enums/UserStatus'

export default interface UserCreateDTO {
  email_validation_token?: string
  email: string
  internal_or_sso: AuthentificationMode
  password: string
  status: UserStatus
  user_language: string | ''
}
