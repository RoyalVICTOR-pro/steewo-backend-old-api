import Env from '@ioc:Adonis/Core/Env'
// import { MailGunSender as Mail } from 'App/Utils/MailGunSender'
import { MailJetSender as Mail } from 'App/Utils/MailJetSender'

export default class MailService {
  private static shouldSendEmail: boolean = Env.get('SEND_EMAIL') === 'true' ? true : false
  private static emailSender: string = 'no-reply@steewo.io'

  public static async sendStudentEmailVerificationMail(
    email: string,
    token: string,
    firstname: string
  ) {
    if (this.shouldSendEmail === true) {
      await Mail.send({
        from: this.emailSender,
        to: email,
        subject: 'Steewo - Merci de vérifier ton email',
        html_view: 'emails/student_email_validation',
        variables_for_view: {
          token: token,
          email: email,
          firstname: firstname,
        },
      })
    }
  }

  public static async sendClientEmailVerificationMail(
    email: string,
    token: string,
    firstname: string
  ) {
    if (this.shouldSendEmail === true) {
      await Mail.send({
        from: this.emailSender,
        to: email,
        subject: 'Steewo - Merci de vérifier votre email',
        html_view: 'emails/client_email_validation',
        variables_for_view: {
          token: token,
          email: email,
          firstname: firstname,
        },
      })
    }
  }

  public static async sendForgotPasswordMail(email: string, token: string) {
    if (this.shouldSendEmail === true) {
      await Mail.send({
        from: this.emailSender,
        to: email,
        subject: 'Steewo - Modifiez votre mot de passe',
        html_view: 'emails/password_reset',
        variables_for_view: {
          token: token,
          email: email,
        },
      })
    }
  }
}
