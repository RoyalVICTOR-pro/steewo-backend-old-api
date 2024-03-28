// SERVICES
import MailService from '@Services/MailServices/MailService'

export default class ClientMailService extends MailService {
  private static emailsViewPath: string = 'emails/clients/'

  public static async sendClientEmailVerificationMail(
    email: string,
    token: string,
    firstname: string
  ) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Merci de valider votre email',
      html_view: this.emailsViewPath + 'client_email_validation',
      variables_for_view: {
        token: token,
        email: email,
        firstname: firstname,
      },
    }

    await this.sendMail(options)
  }
}
