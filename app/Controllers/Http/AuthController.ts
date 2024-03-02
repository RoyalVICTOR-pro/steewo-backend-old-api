import { inject, Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthService } from '@Services/AuthService'
import { UserCreateDTO } from '@DTO/UserCreateDTO'
import AuthentificationMode from '@Enums/AuthentificationMode'
import UserCreateValidator from '@Validators/UserCreateValidator'
import UserLoginValidator from '@Validators/UserLoginValidator'
import TooManyRequestsException from 'App/Exceptions/TooManyRequestsException'
import Role from 'App/Enums/Roles'

const acceptLanguage = require('accept-language-parser')
const { v4: uuidv4 } = require('uuid')

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

    const verificationToken = uuidv4()

    const userData: UserCreateDTO = {
      email: data.email,
      password: data.password,
      user_language: languages[0],
      internal_or_sso: AuthentificationMode.INTERNAL,
      email_validation_token: verificationToken,
    }

    const user = await this.authService.createUserAccount(userData)
    return response.created(user) // 201 CREATED
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const loginData = await request.validate(UserLoginValidator)

      const loginResponse: any = await this.authService.authenticateUser(loginData, auth)

      if (!loginResponse) {
        return response.status(401).send('Identifiant et/ou mot de passe incorrects.')
      }

      response.cookie('access_token', loginResponse.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: '24h',
      })

      return response.status(200).send({ user: loginResponse.user })
    } catch (error) {
      if (error instanceof TooManyRequestsException) {
        return response
          .status(429)
          .send('Trop de tentatives de connexion infructueuses. Réessayez plus tard.')
      } else if (error.status === 403) {
        return response.status(403).send('Accès non-autorisé.')
      } else {
        return response.status(401).send('Identifiant et/ou mot de passe incorrects.')
      }
    }
  }

  public async me({ response, auth }: HttpContextContract) {
    try {
      const user = await this.authService.getAuthenticatedUser(auth)
      return response.status(200).json({ user })
    } catch (error) {
      return response.status(401).send('Accès non-autorisé.')
    }
  }

  public async loginAsAdmin({ request, response, auth }: HttpContextContract) {
    try {
      const loginData = await request.validate(UserLoginValidator)

      const loginResponse: any = await this.authService.authenticateUser(loginData, auth)

      if (!loginResponse) {
        return response.status(401).send('Identifiant et/ou mot de passe incorrects.')
      }

      response.cookie('access_token', loginResponse.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: '24h',
      })

      if (loginResponse.user.role !== Role.ADMIN) {
        throw new Exception('Forbidden', 403, 'E_FORBIDDEN')
      }

      return response.status(200).send({ user: loginResponse.user })
    } catch (error) {
      if (error instanceof TooManyRequestsException) {
        return response
          .status(429)
          .send('Trop de tentatives de connexion infructueuses. Réessayez plus tard.')
      } else if (error.status === 403) {
        return response.status(403).send('Accès non-autorisé.')
      } else {
        return response.status(401).send('Identifiant et/ou mot de passe incorrects.')
      }
    }
  }

  public async meAsAdmin({ response, auth }: HttpContextContract) {
    try {
      const user = await this.authService.getAuthenticatedUser(auth)
      if (user.role !== Role.ADMIN) return response.status(403).send('Accès non-autorisé.')
      return response.status(200).json({ user })
    } catch (error) {
      return response.status(401).send('Accès non-autorisé.')
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    this.authService.logoutUser(auth)
    return response.status(200).send('Vous avez été déconnecté avec succès.')
  }
}
