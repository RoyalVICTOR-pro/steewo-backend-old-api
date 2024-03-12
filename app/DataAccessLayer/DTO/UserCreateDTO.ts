import AuthentificationMode from '@Enums/AuthentificationMode'
import UserStatus from '@Enums/UserStatus'

export interface UserCreateDTO {
  email: string
  password: string
  user_language: string | ''
  internal_or_sso: AuthentificationMode
  email_validation_token?: string
  status: UserStatus
}
