// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// SERVICES
import StudentProfileValidationProcessService from '@Services/StudentProfileValidationProcessService'
// VALIDATORS
import RejectProfileOrNewProfessionValidator from '@Validators/RejectProfileOrNewProfessionValidator'

@inject()
export default class StudentsProfileValidationProcessController {
  private studentProfileValidationProcessService: StudentProfileValidationProcessService
  constructor(studentProfileValidationProcessService: StudentProfileValidationProcessService) {
    this.studentProfileValidationProcessService = studentProfileValidationProcessService
  }

  // PROFILE VALIDATION
  public async askProfileValidation({ params, response }: HttpContextContract) {
    await this.studentProfileValidationProcessService.askProfileValidation(
      Number(params.student_profile_id)
    )
    return response.status(200).send('Profile validation asked') // 200 OK
  }

  public async getValidationRequests({ response }: HttpContextContract) {
    const validationRequests =
      await this.studentProfileValidationProcessService.getValidationRequests()
    return response.ok(validationRequests) // 200 OK
  }

  public async validateProfile({ params, response }: HttpContextContract) {
    await this.studentProfileValidationProcessService.validateProfile(
      Number(params.student_profile_id)
    )
    return response.status(200).send('Profile validated') // 200 OK
  }

  public async rejectProfileValidation({ request, params, response }: HttpContextContract) {
    const data = await request.validate(RejectProfileOrNewProfessionValidator)

    await this.studentProfileValidationProcessService.rejectProfileValidation(
      Number(params.student_profile_id),
      data.comment
    )
    return response.status(200).send('Profile validation rejected') // 200 OK
  }

  // NEW PROFESSION VALIDATION
  public async askNewProfessionValidation({ params, response }: HttpContextContract) {
    await this.studentProfileValidationProcessService.askNewProfessionValidation(
      Number(params.student_profile_id),
      Number(params.profession_id)
    )
    return response.status(200).send('New profession validation asked') // 200 OK
  }

  public async getProfessionsValidationRequests({ response }: HttpContextContract) {
    const validationRequests =
      await this.studentProfileValidationProcessService.getProfessionsValidationRequests()
    return response.ok(validationRequests) // 200 OK
  }

  public async validateNewProfession({ params, response }: HttpContextContract) {
    await this.studentProfileValidationProcessService.validateNewProfession(
      Number(params.student_profile_id),
      Number(params.profession_id)
    )
    return response.status(200).send('New profession validated') // 200 OK
  }

  public async rejectNewProfessionValidation({ request, params, response }: HttpContextContract) {
    const data = await request.validate(RejectProfileOrNewProfessionValidator)

    await this.studentProfileValidationProcessService.rejectNewProfessionValidation(
      Number(params.student_profile_id),
      Number(params.profession_id),
      data.comment
    )
    return response.status(200).send('New profession validation rejected') // 200 OK
  }
}
