import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthService } from 'App/Services/AuthService'
import { UserCreateDTO } from 'App/DataAccessLayer/DTO/UserCreateDTO'
import AuthentificationMode from 'App/Enums/AuthentificationMode'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import AuthControllerInterface from './AuthControllerInterface'

const acceptLanguage = require('accept-language-parser')

@inject()
export default class AuthController implements AuthControllerInterface {
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
}
