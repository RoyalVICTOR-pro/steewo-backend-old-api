// SERVICES
import MailService from '@Services/MailServices/MailService'

export default class StudentMailService extends MailService {
  private static emailsViewPath: string = 'emails/students/'

  public static async sendStudentEmailVerificationMail(
    email: string,
    token: string,
    firstname: string
  ) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Merci de valider ton email',
      html_view: this.emailsViewPath + 'student_email_validation',
      variables_for_view: {
        token: token,
        email: email,
        firstname: firstname,
      },
    }

    await this.sendMail(options)
  }
}
