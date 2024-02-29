import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class IsValidEmail {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user

    if (user && user.is_valid_email) {
      await next()
    } else {
      throw new AuthenticationException('Accès non autorisé', 'E_UNAUTHORIZED_ACCESS')
    }
  }
}
