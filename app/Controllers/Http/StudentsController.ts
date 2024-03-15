import { inject, Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentProfileBannerUpdateValidator from '@Validators/StudentProfileBannerUpdateValidator'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileCreateValidator from '@Validators/StudentProfileCreateValidator'
import StudentProfileDescriptionUpdateValidator from '@Validators/StudentProfileDescriptionUpdateValidator'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import StudentProfileMainUpdateValidator from '@Validators/StudentProfileMainUpdateValidator'
import StudentProfilePhotoUpdateValidator from '@Validators/StudentProfilePhotoUpdateValidator'
import StudentProfileService from '@Services/StudentProfileService'
import UserCharterAcceptationValidator from '@Validators/UserCharterAcceptationValidator'
import Role from 'App/Enums/Roles'
import User from 'App/Models/User'
import AuthService from 'App/Services/AuthService'

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

  public async getStudentPrivateProfile({ params, response }: HttpContextContract) {
    const studentPrivateProfile = await this.studentProfileService.getStudentPrivateProfile(
      Number(params.user_id)
    )
    return response.ok(studentPrivateProfile) // 200 OK
  }

  public async updateStudentProfileMainInfo({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfileMainUpdateValidator)
    const updatedStudentProfile: StudentProfileMainUpdateDTO = {
      address_city: data.address_city,
      address_number: data.address_number,
      address_postal_code: data.address_postal_code,
      address_road: data.address_road,
      bank_iban: data.bank_iban,
      current_diploma: data.current_diploma,
      current_school: data.current_school,
      date_of_birth: data.date_of_birth,
      firstname: data.firstname,
      job_title: data.job_title,
      gender: parseInt(data.gender),
      last_diploma: data.last_diploma,
      last_diploma_school: data.last_diploma_school,
      lastname: data.lastname,
      mobile: data.mobile,
      place_of_birth: data.place_of_birth,
      siret_number: data.siret_number,
    }
    const studentProfile = await this.studentProfileService.updateStudentProfileMainInfo(
      Number(params.user_id),
      updatedStudentProfile,
      data.school_certificate_file,
      data.company_exists_proof_file
    )
    return response.ok(studentProfile) // 200 OK
  }

  public async updateStudentProfilePhoto({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfilePhotoUpdateValidator)

    const studentProfile = await this.studentProfileService.updateStudentProfilePhoto(
      Number(params.user_id),
      data.photo_file
    )
    return response.ok(studentProfile) // 200 OK
  }

  public async updateStudentProfileBanner({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfileBannerUpdateValidator)

    const studentProfile = await this.studentProfileService.updateStudentProfileBanner(
      Number(params.user_id),
      data.banner_file
    )
    return response.ok(studentProfile) // 200 OK
  }

  public async deleteStudentProfilePhoto({ params, response }: HttpContextContract) {
    await this.studentProfileService.deleteStudentProfilePhoto(Number(params.student_profile_id))
    return response.noContent() // 204 NO CONTENT
  }

  public async deleteStudentProfileBanner({ params, response }: HttpContextContract) {
    await this.studentProfileService.deleteStudentProfileBanner(Number(params.student_profile_id))
    return response.noContent() // 204 NO CONTENT
  }

  public async updateStudentProfileDescription({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfileDescriptionUpdateValidator)

    if (!data.description) {
      data.description = ''
    }

    const studentProfile = await this.studentProfileService.updateStudentProfileDescription(
      Number(params.user_id),
      data.description
    )
    return response.ok(studentProfile) // 200 OK
  }

  public async acceptStudentCharter({ request, params, response }: HttpContextContract) {
    const data = await request.validate(UserCharterAcceptationValidator)
    if (data.has_accepted_steewo_charter !== true) {
      throw new Exception('Charter not accepted', 400, 'E_BAD_REQUEST')
    }
    const updatedUser = await this.studentProfileService.acceptStudentCharter(
      Number(params.user_id)
    )
    return response.status(200).send(updatedUser)
  }

  public async getStudentViewsCount({ auth, response }: HttpContextContract) {
    const studentViewsCount = await this.studentProfileService.getStudentViewsCount(auth.user!.id)
    return response.ok({ nb_views: studentViewsCount }) // 200 OK
  }

  public async getStudentBookmarksCount({ auth, response }: HttpContextContract) {
    const studentBookmarksCount = await this.studentProfileService.getStudentBookmarksCount(
      auth.user!.id
    )
    return response.ok({ nb_bookmarks: studentBookmarksCount }) // 200 OK
  }

  public async addViewToStudentProfile({ auth, params, response }: HttpContextContract) {
    let userRole: number = await AuthService.getRoleByAuth(auth)
    if (userRole !== Role.CLIENT_INDIVIDUAL && userRole !== Role.CLIENT_PROFESSIONAL) {
      throw new Exception('You cannot add a view to a student profile', 400, 'E_BAD_REQUEST')
    }
    if (
      await this.studentProfileService.addViewToStudentProfile(
        Number(params.student_profile_id),
        Number(params.client_profile_id)
      )
    ) {
      return response.status(200).send('View added') // 200 OK
    }
    return response.status(400).send('View already added') // 400 BAD REQUEST
  }

  public async toggleStudentProfileBookmark({ auth, params, response }: HttpContextContract) {
    let userRole: number = await AuthService.getRoleByAuth(auth)
    if (userRole !== Role.CLIENT_INDIVIDUAL && userRole !== Role.CLIENT_PROFESSIONAL) {
      throw new Exception('You cannot add a view to a student profile', 400, 'E_BAD_REQUEST')
    }

    await this.studentProfileService.toggleStudentProfileBookmark(
      Number(params.student_profile_id),
      Number(params.client_profile_id)
    )

    return response.status(200).send('Bookmark toggled') // 200 OK
  }

  public async isStudentProfileBookmarked({ auth, params, response }: HttpContextContract) {
    let userRole: number = await AuthService.getRoleByAuth(auth)
    if (userRole !== Role.CLIENT_INDIVIDUAL && userRole !== Role.CLIENT_PROFESSIONAL) {
      throw new Exception('You cannot add a view to a student profile', 400, 'E_BAD_REQUEST')
    }

    const isBookmarked = await this.studentProfileService.isStudentProfileBookmarked(
      Number(params.student_profile_id),
      Number(params.client_profile_id)
    )

    return response.ok(isBookmarked) // 200 OK
  }
}
