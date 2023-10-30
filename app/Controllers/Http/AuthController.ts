import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthService } from 'App/Services/AuthService'
import { UserCreateDTO } from 'App/DataAccessLayer/DTO/UserCreateDTO'
import AuthentificationMode from 'App/Enums/AuthentificationMode'
import UserCreateValidator from 'App/Validators/UserCreateValidator'
import UserLoginValidator from 'App/Validators/UserLoginValidator'
import TooManyRequestsException from 'App/Exceptions/TooManyRequestsException'

const acceptLanguage = require('accept-language-parser')

@inject()
export default class AuthController {
  private authService: AuthService
  constructor(authService: AuthService) {
    this.authService = authService
  }

  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(UserCreateValidator)

    const acceptLangHeader = request.header('Accept-Language')
    const languages = acceptLanguage.parse(acceptLangHeader)

    const userData: UserCreateDTO = {
      email: data.email,
      password: data.password,
      user_language: languages[0],
      internal_or_sso: AuthentificationMode.INTERNAL,
    }

    const user = await this.authService.createUserAccount(userData)
    return response.created(user) // 201 CREATED
  }

  public async login({ request, response, auth }: HttpContextContract) {
    // TODO : Activer le mode strict de la politique CORS
    try {
      const loginData = await request.validate(UserLoginValidator)

      const token: any = await this.authService.authenticateUser(loginData, auth)

      if (!token) {
        return response.status(401).json({ errors: 'Invalid credentials' })
      }
      return response.status(200).json({ token })
    } catch (error) {
      // console.log('error :>> ', error)
      if (error instanceof TooManyRequestsException) {
        return response.status(429).json({ errors: error.message })
      } else {
        return response.status(401).json({ errors: 'Invalid credentials' })
      }
    }
  }
}
