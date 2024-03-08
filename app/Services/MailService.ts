import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class MailService {
  private static shouldSendEmail: boolean = Env.get('SEND_EMAIL')
  private static emailSender: string = 'no-reply@steewo.io'

  public static async sendStudentEmailVerificationMail(
    email: string,
    token: string,
    firstname: string
  ) {
    if (this.shouldSendEmail === true) {
      await Mail.send((message) => {
        message
          .from(this.emailSender)
          .to(email)
          .subject('Steewo - Merci de vérifier ton email')
          .htmlView('emails/student_email_validation', {
            token: token,
            email: email,
            firstname: firstname,
          })
      })
    }
  }

  public static async sendClientEmailVerificationMail(
    email: string,
    token: string,
    firstname: string
  ) {
    if (this.shouldSendEmail === true) {
      await Mail.send((message) => {
        message
          .from(this.emailSender)
          .to(email)
          .subject('Steewo - Merci de vérifier votre email')
          .htmlView('emails/client_email_validation', {
            token: token,
            email: email,
            firstname: firstname,
          })
      })
    }
  }

  public static async sendForgotPasswordMail(email: string, token: string) {
    if (this.shouldSendEmail === true) {
      await Mail.send((message) => {
        message
          .from(this.emailSender)
          .to(email)
          .subject('Steewo - Modifiez votre mot de passe')
          .htmlView('emails/password_reset', {
            token: token,
            email: email,
          })
      })
    }
  }
}
