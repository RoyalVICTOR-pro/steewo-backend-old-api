import View from '@ioc:Adonis/Core/View'
import Mailjet from 'node-mailjet'
import Env from '@ioc:Adonis/Core/Env'

export class MailJetSender {
  public static async send(data: {
    from: string
    to: string
    subject: string
    html_view: string
    variables_for_view: object
  }) {
    const html = await View.render(data.html_view, data.variables_for_view)

    const mailjet = Mailjet.apiConnect(
      Env.get('MAILJET_APIKEY_PUBLIC'),
      Env.get('MAILJET_APIKEY_PRIVATE')
    )

    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: data.from,
            Name: 'Ne pas répondre - Steewo',
          },
          To: [
            {
              Email: data.to,
            },
          ],
          Subject: data.subject,
          HTMLPart: html,
        },
      ],
    })

    request
      .then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
        console.log(err.message)
      })
  }
}
