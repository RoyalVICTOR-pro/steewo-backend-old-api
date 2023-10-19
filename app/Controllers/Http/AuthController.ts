import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthService } from 'App/Services/AuthService'
import { UserCreateDTO } from 'App/DataAccessLayer/DTO/UserCreateDTO'
import AuthentificationMode from 'App/Enums/AuthentificationMode'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
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
    try {
      // Valider les données de la requête en utilisant le validateur prestationUpdate
      const data = await request.validate(CreateUserValidator)

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
    } catch (error) {
      console.log('error :>> ', error)
      // Gérer les erreurs de validation en utilisant les messages d'erreur traduits
      return response.status(400).json({ errors: error.messages })
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    // Récupérer les données de la requête, les vérifier et les valider et ensuite utiliser l'AuthService pour se connecter
    try {
      // Valider les données de la requête en utilisant le validateur prestationUpdate
      const loginData = await request.validate(UserLoginValidator)

      const tokenAndUserInfo: any = await this.authService.authenticateUser(loginData, auth)

      if (!tokenAndUserInfo) {
        return response.status(401).json({ errors: 'Invalid credentials' })
      }
      return response.status(200).json({ tokenAndUserInfo })
    } catch (error) {
      console.log('error :>> ', error)
      if (error instanceof TooManyRequestsException) {
        return response.status(429).json({ errors: error.message })
      } else {
        return response.status(401).json({ errors: 'Invalid credentials' })
      }
    }
  }
}
