import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default interface AuthControllerInterface {
  register({ request, response }: HttpContextContract): Promise<void>
}
