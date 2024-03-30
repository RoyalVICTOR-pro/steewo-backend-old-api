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

  public static async sendStudentProfileValidationRejectedMail(
    email: string,
    firstname: string,
    comment: string
  ) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Ton profil a été refusé',
      html_view: this.emailsViewPath + 'student_profile_rejected',
      variables_for_view: {
        firstname: firstname,
        comment: comment,
      },
    }

    await this.sendMail(options)
  }

  public static sendStudentProfileValidationRequestMail() {
    const options = {
      from: this.emailSender,
      to: this.validationAdminEmail,
      subject: 'Steewo - Demande de validation de profil',
      html_view: this.adminEmailsViewPath + 'student_profile_validation_asked',
      variables_for_view: {
        backoffice_url: this.backofficeURL,
      },
    }

    this.sendMail(options)
  }

  public static async sendStudentProfileValidationAcceptedMail(email: string, firstname: string) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Ton profil a été validé',
      html_view: this.emailsViewPath + 'student_profile_accepted',
      variables_for_view: {
        firstname: firstname,
      },
    }

    await this.sendMail(options)
  }

  public static async sendStudentNewProfessionValidationRejectedMail(
    email: string,
    firstname: string,
    professionName: string,
    comment: string
  ) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Ton nouveau métier a été refusé',
      html_view: this.emailsViewPath + 'student_new_profession_rejected',
      variables_for_view: {
        firstname: firstname,
        comment: comment,
        profession: professionName,
      },
    }

    await this.sendMail(options)
  }

  public static sendStudentNewProfessionValidationRequestMail() {
    const options = {
      from: this.emailSender,
      to: this.validationAdminEmail,
      subject: "Steewo - Demande de validation d'un nouveau métier",
      html_view: this.adminEmailsViewPath + 'student_new_profession_validation_asked',
      variables_for_view: {
        backoffice_url: this.backofficeURL,
      },
    }

    this.sendMail(options)
  }

  public static async sendStudentNewProfessionValidationAcceptedMail(
    email: string,
    firstname: string,
    professionName: string
  ) {
    const options = {
      from: this.emailSender,
      to: email,
      subject: 'Steewo - Ton nouveau métier a été validé',
      html_view: this.emailsViewPath + 'student_new_profession_accepted',
      variables_for_view: {
        firstname: firstname,
        profession: professionName,
      },
    }

    await this.sendMail(options)
  }
}
