// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
// INTERFACES
import StudentProfileValidationProcessServiceInterface from '@Services/Interfaces/StudentProfileValidationProcessServiceInterface'
// MODELS
import Profession from '@Models/Profession'
// REPOSITORIES
import StudentProfileAndProfessionRelationRepository from '@DALRepositories/StudentAndProfessionRelationRepository'
import StudentProfileAndServiceRelationRepository from '@DALRepositories/StudentAndServiceRelationRepository'
import StudentProfileRepository from '@DALRepositories/StudentProfileRepository'
// SERVICES
import StudentMailService from '@Services/MailServices/StudentMailService'
import NotificationService from './NotificationService'

@inject()
export default class StudentProfileValidationProcessService
  implements StudentProfileValidationProcessServiceInterface
{
  private studentProfileRepository: StudentProfileRepository
  private studentProfileAndProfessionRelationRepository: StudentProfileAndProfessionRelationRepository
  private studentProfileAndServiceRelationRepository: StudentProfileAndServiceRelationRepository

  constructor(studentProfileRepository: StudentProfileRepository) {
    this.studentProfileRepository = studentProfileRepository
    this.studentProfileAndProfessionRelationRepository =
      new StudentProfileAndProfessionRelationRepository()
    this.studentProfileAndServiceRelationRepository =
      new StudentProfileAndServiceRelationRepository()
  }

  public async askProfileValidation(studentProfileId: number) {
    await this.studentProfileRepository.askProfileValidation(studentProfileId)
    await StudentMailService.sendStudentProfileValidationRequestMail()
  }

  public async validateProfile(studentProfileId: number) {
    const student = await this.studentProfileRepository.getStudentProfileById(studentProfileId)
    if (!student || !student.firstname) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }

    await this.studentProfileAndProfessionRelationRepository.acceptAllProfessionsOfAStudent(
      studentProfileId
    )
    await this.studentProfileAndServiceRelationRepository.acceptAllServicesOfAStudent(
      studentProfileId
    )

    await this.studentProfileRepository.validateProfile(studentProfileId)

    await NotificationService.createNotification({
      user_id: student.user_id,
      title: 'Info Profil',
      content:
        "Ton profil a été validé par l'équipe Steewo. Tu peux désormais postuler à des missions.",
    })

    await StudentMailService.sendStudentProfileValidationAcceptedMail(
      student.user.email,
      student.firstname
    )
  }

  public async getValidationRequests() {
    return await this.studentProfileRepository.getValidationRequests()
  }

  public async rejectProfileValidation(studentProfileId: number, comment: string) {
    const student = await this.studentProfileRepository.getStudentProfileById(studentProfileId)
    if (!student || !student.firstname) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    await this.studentProfileRepository.rejectProfileValidation(studentProfileId)

    await NotificationService.createNotification({
      user_id: student.user_id,
      title: 'Info Profil',
      content: "Ton profil a été refusé par l'équipe Steewo : " + comment,
    })

    await StudentMailService.sendStudentProfileValidationRejectedMail(
      student.user.email,
      student.firstname,
      comment
    )
  }

  public async askNewProfessionValidation(studentProfileId: number, professionId: number) {
    const student = await this.studentProfileRepository.getStudentProfileById(studentProfileId)
    if (!student || !student.firstname) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    const profession = await Profession.find(professionId)
    if (!profession) {
      throw new Exception('Profession not found', 404, 'E_NOT_FOUND')
    }

    await this.studentProfileAndProfessionRelationRepository.askNewProfessionValidation(
      studentProfileId,
      professionId
    )

    await StudentMailService.sendStudentNewProfessionValidationRequestMail()
  }

  public async getProfessionsValidationRequests() {
    return await this.studentProfileAndProfessionRelationRepository.getProfessionsValidationRequests()
  }

  public async rejectNewProfessionValidation(
    studentProfileId: number,
    professionId: number,
    comment: string
  ) {
    const student = await this.studentProfileRepository.getStudentProfileById(studentProfileId)
    if (!student || !student.firstname) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    const profession = await Profession.find(professionId)
    if (!profession) {
      throw new Exception('Profession not found', 404, 'E_NOT_FOUND')
    }

    await this.studentProfileAndProfessionRelationRepository.rejectNewProfessionValidation(
      studentProfileId,
      professionId
    )

    await NotificationService.createNotification({
      user_id: student.user_id,
      title: 'Info Profil',
      content:
        'Ton nouveau métier ' + profession.name + " a été refusé par l'équipe Steewo : " + comment,
    })

    await StudentMailService.sendStudentNewProfessionValidationRejectedMail(
      student.user.email,
      student.firstname,
      profession.name,
      comment
    )
  }

  public async validateNewProfession(studentProfileId: number, professionId: number) {
    const student = await this.studentProfileRepository.getStudentProfileById(studentProfileId)
    if (!student || !student.firstname) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    const profession = await Profession.find(professionId)
    if (!profession) {
      throw new Exception('Profession not found', 404, 'E_NOT_FOUND')
    }

    await this.studentProfileAndProfessionRelationRepository.validateNewProfession(
      studentProfileId,
      professionId
    )

    await this.studentProfileAndServiceRelationRepository.validateServicesOfTheNewProfession(
      studentProfileId,
      professionId
    )

    await NotificationService.createNotification({
      user_id: student.user_id,
      title: 'Info Profil',
      content: 'Ton nouveau métier ' + profession.name + " a été validé par l'équipe Steewo.",
    })

    await StudentMailService.sendStudentNewProfessionValidationAcceptedMail(
      student.user.email,
      student.firstname,
      profession.name
    )
  }
}
