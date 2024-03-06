import AuthentificationMode from '@Enums/AuthentificationMode'
import ClientUserStatus from 'App/Enums/ClientUserStatus'
import StudentUserStatus from 'App/Enums/StudentUserStatus'

export interface UserCreateDTO {
  email: string
  password: string
  user_language: string | ''
  internal_or_sso: AuthentificationMode
  email_validation_token?: string
  status: UserStatus
}
