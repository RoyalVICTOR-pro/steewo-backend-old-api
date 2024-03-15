import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientProfile from '@Models/ClientProfile'

export default class IsClientProfileOwner {
  public async handle({ auth, params, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user
    if (params.user_id) {
      if (user?.id !== Number(params.user_id)) {
        return response.unauthorized({ message: 'You can only access your own profile.' })
      }
    }
    if (params.client_profile_id) {
      const clientProfile = await ClientProfile.findBy('id', params.client_profile_id)
      if (user?.id !== clientProfile?.user_id) {
        return response.unauthorized({ message: 'You can only access your own profile.' })
      }
    }
    await next()
  }
}
