import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export class MailGunSender {
  public static async send(data: {
    from: string
    to: string
    subject: string
    html_view: string
    variables_for_view: object
  }) {
    data.variables_for_view['api_url'] = Env.get('API_URL')
    await Mail.send((message) => {
      message
        .from(data.from)
        .to(data.to)
        .subject(data.subject)
        .htmlView(data.html_view, data.variables_for_view)
    })
  }
}
