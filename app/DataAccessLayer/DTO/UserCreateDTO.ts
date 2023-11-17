import AuthentificationMode from '@Enums/AuthentificationMode'

export interface UserCreateDTO {
  email: string
  password: string
  user_language: string | ''
  internal_or_sso: AuthentificationMode
}
