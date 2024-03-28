// ADONIS
import Env from '@ioc:Adonis/Core/Env'
// UTILS
// import { MailGunSender as Mail } from '@Utils/MailGunSender'
import { MailJetSender as Mail } from '@Utils/MailJetSender'

export default class MailService {
  protected static shouldSendEmail: boolean = Env.get('SEND_EMAIL') === 'true' ? true : false
  protected static backofficeURL: string = Env.get('BACKOFFICE_URL')
  protected static emailSender: string = 'no-reply@steewo.io'
  protected static validationAdminEmail: string = 'royal@steewo.io'
  protected static adminEmailsViewPath: string = 'emails/admin/'

  protected static async sendMail(options: {
    from: string
    to: string
    subject: string
    html_view: string
    variables_for_view: any
  }) {
    if (this.shouldSendEmail === true) {
      await Mail.send(options)
    }
  }
}
