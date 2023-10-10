import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthServiceContract from 'App/Services/ServicesContracts/AuthServiceContract'
import { UserCreateDTO } from 'App/DataAccessLayer/DTO/UserCreateDTO'
import AuthentificationMode from 'App/Enum/AuthentificationMode'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import { inject } from '@adonisjs/core/build/standalone'

const acceptLanguage = require('accept-language-parser')

@inject()
export class AuthController {
  constructor(private authService: AuthServiceContract) {}

  public async register({ request, response }: HttpContextContract) {
    try {
      // Valider les données de la requête en utilisant le validateur prestationUpdate
      const data = await request.validate(CreateUserValidator)

      const acceptLangHeader = request.header('Accept-Language')
      const languages = acceptLanguage.parse(acceptLangHeader)

      console.log('AuthentificationMode.INTERNAL :>> ', AuthentificationMode.INTERNAL)

      const userData: UserCreateDTO = {
        email: data.email,
        password: data.password,
        user_language: languages[0],
        internal_or_sso: AuthentificationMode.INTERNAL,
      }

      console.log('this.authService :>> ', this.authService) // return this.authService :>>  { AuthService: [class AuthService] }
      const user = await this.authService.createUserAccount(userData)
      return response.created(user) // 201 CREATED
    } catch (error) {
      console.log('error :>> ', error)
      // Gérer les erreurs de validation en utilisant les messages d'erreur traduits
      return response.status(400).json({ errors: error.messages })
    }
  }
}
