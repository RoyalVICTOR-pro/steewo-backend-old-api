import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsClientProfileOwner {
  public async handle({ auth, params, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user
    if (user?.id !== Number(params.user_id)) {
      return response.unauthorized({ message: 'You can only access your own profile.' })
    }
    await next()
  }
}
