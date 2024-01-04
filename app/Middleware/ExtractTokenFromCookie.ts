import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExtractTokenFromCookie {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const token = ctx.request.cookie('access_token')
    if (token) {
      ctx.request.headers().authorization = `Bearer ${token}`
    }

    await next()
  }
}
