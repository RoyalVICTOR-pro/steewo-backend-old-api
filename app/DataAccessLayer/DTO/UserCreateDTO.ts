import AuthentificationMode from 'App/Enum/AuthentificationMode'

export default interface UserCreateDTO {
  email: string
  password: string
  user_language: string | ''
  internal_or_sso: AuthentificationMode
}
