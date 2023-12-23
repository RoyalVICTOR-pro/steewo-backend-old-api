import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExtractTokenFromCookie {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    console.log('passé dans ExtractTokenFromCookie middleware')
    const cookieHeader = ctx.request.headers().cookie
    console.log('cookie header: ', cookieHeader)
    if (cookieHeader) {
      const token = cookieHeader.split('=')[1]

      // const token = ctx.request.cookie('token')
      console.log('access token from cookie :>> ', token)

      if (token) {
        ctx.request.headers().authorization = `Bearer ${token}`
      }
    }
    // const token = ctx.request.cookie('token')

    await next()
  }
}
