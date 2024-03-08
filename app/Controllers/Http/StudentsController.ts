import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StudentProfileService } from '@Services/StudentProfileService'
import StudentProfileCreateValidator from '@Validators/StudentProfileCreateValidator'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'
import { inject } from '@adonisjs/core/build/standalone'

@inject()
export default class StudentProfilesController {
  private studentProfileService: StudentProfileService
  constructor(studentProfileService: StudentProfileService) {
    this.studentProfileService = studentProfileService
  }

  public async createStudentProfile({ request, response }: HttpContextContract) {
    const data: StudentProfileCreateDTO = await request.validate(StudentProfileCreateValidator)
    const studentProfile = await this.studentProfileService.createStudentProfile(data)
    return response.created(studentProfile) // 201 CREATED
  }

  public async getStudentPublicProfile({ params, response }: HttpContextContract) {
    const studentPublicProfile = await this.studentProfileService.getStudentPublicProfile(
      Number(params.user_id)
    )
    return response.ok(studentPublicProfile) // 200 OK
  }
}
