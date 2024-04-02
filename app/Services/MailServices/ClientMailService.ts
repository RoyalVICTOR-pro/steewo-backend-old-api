// SERVICES
import MailService from '@Services/MailServices/MailService'
// REPOSITORIES
import UserRepository from '@DALRepositories/UserRepository'

export default class ClientMailService extends MailService {
  private static emailsViewPath: string = 'emails/clients/'

  private static async userHasEnabledEmailNotifications(email: string): Promise<boolean> {
    const userRepository = new UserRepository()
    const user = await userRepository.getUserByEmail(email)
    if (!user) {
      return false
    }
    return user.has_enabled_email_notifications
  }

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
