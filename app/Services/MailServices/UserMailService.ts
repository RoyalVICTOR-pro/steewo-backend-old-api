// SERVICES
import MailService from '@Services/MailServices/MailService'

export default class UserMailService extends MailService {
  private static emailsViewPath: string = 'emails/'

  public static async sendForgotPasswordMail(email: string, token: string) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Modification du mot de passe',
      html_view: this.emailsViewPath + 'password_reset',
      variables_for_view: {
        token: token,
        email: email,
      },
    }

    await this.sendMail(options)
  }
}
