import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthService } from '@Services/AuthService'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import AuthentificationMode from '@Enums/AuthentificationMode'
import UserCreateValidator from '@Validators/UserCreateValidator'
import UserLoginValidator from '@Validators/UserLoginValidator'
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

      const loginResponse: any = await this.authService.authenticateUser(loginData, auth)

      if (!loginResponse) {
        return response.status(401).json({ errors: 'Invalid credentials' })
      }

      response.cookie('access_token', loginResponse.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: '24h',
      })

      return response.status(200).send({ user: loginResponse.user })
    } catch (error) {
      // console.log('error :>> ', error)
      if (error instanceof TooManyRequestsException) {
        return response.status(429).json({ errors: error.message })
      } else {
        return response.status(401).json({ errors: 'Invalid credentials' })
      }
    }
  }

  public async me({ response, auth }: HttpContextContract) {
    try {
      const user = await this.authService.getAuthenticatedUser(auth)
      return response.status(200).json({ user })
    } catch (error) {
      return response.status(401).json({ errors: 'Unauthorized access' })
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    this.authService.logoutUser(auth)
    return response.status(204).json({ message: 'User logged out' })
  }
}
