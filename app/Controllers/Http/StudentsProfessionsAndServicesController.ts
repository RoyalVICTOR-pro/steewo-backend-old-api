// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// SERVICES
import StudentProfessionsAndServicesService from '@Services/StudentProfessionsAndServicesService'
// VALIDATORS
import StudentProfilesProfessionsAddValidator from '@Validators/StudentProfilesProfessionsAddValidator'
import StudentProfilesServicesAddValidator from '@Validators/StudentProfilesServicesAddValidator'

@inject()
export default class StudentsProfessionsAndServicesController {
  private studentProfessionsAndServicesService: StudentProfessionsAndServicesService
  constructor(studentProfessionsAndServicesService: StudentProfessionsAndServicesService) {
    this.studentProfessionsAndServicesService = studentProfessionsAndServicesService
  }

  public async addProfessionsToStudentProfile({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfilesProfessionsAddValidator)
    await this.studentProfessionsAndServicesService.addProfessionsToStudentProfile(
      Number(params.student_profile_id),
      data.choosen_professions
    )
    return response.status(200).send('Professions added') // 200 OK
  }

  public async addServicesToStudentProfile({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfilesServicesAddValidator)
    await this.studentProfessionsAndServicesService.addServicesToStudentProfile(
      Number(params.student_profile_id),
      data.choosen_services
    )
    return response.status(200).send('Services added') // 200 OK
  }

  public async getStudentPublicProfessions({ params, response }: HttpContextContract) {
    const studentPublicProfessions =
      await this.studentProfessionsAndServicesService.getStudentPublicProfessions(
        Number(params.student_profile_id)
      )
    return response.ok(studentPublicProfessions) // 200 OK
  }

  public async getStudentPrivateProfessions({ params, response }: HttpContextContract) {
    const studentPrivateProfessions =
      await this.studentProfessionsAndServicesService.getStudentPrivateProfessions(
        Number(params.student_profile_id)
      )
    return response.ok(studentPrivateProfessions) // 200 OK
  }

  public async getStudentPublicServices({ params, response }: HttpContextContract) {
    const studentServices =
      await this.studentProfessionsAndServicesService.getStudentPublicServices(
        Number(params.student_profile_id)
      )
    return response.ok(studentServices) // 200 OK
  }

  public async getStudentPrivateServices({ params, response }: HttpContextContract) {
    const studentServices =
      await this.studentProfessionsAndServicesService.getStudentPrivateServices(
        Number(params.student_profile_id)
      )
    return response.ok(studentServices) // 200 OK
  }
}
