// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// DTO
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementUpdateDTO from '@DTO/AchievementUpdateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
// ENUMS
import Role from '@Enums/Roles'
// SERVICES
import AuthService from '@Services/AuthService'
import StudentProfileService from '@Services/StudentProfileService'
// VALIDATORS
import AchievementAddValidator from '@Validators/AchievementAddValidator'
import AchievementUpdateValidator from '@Validators/AchievementUpdateValidator'
import AchievementDetailsAddValidator from '@Validators/AchievementDetailsAddValidator'
import AchievementDetailsUpdateValidator from '@Validators/AchievementDetailsUpdateValidator'
import AchievementDetailsUpdateOrderValidator from '@Validators/AchievementDetailsUpdateOrderValidator'
import AchievementUpdateOrderValidator from '@Validators/AchievementUpdateOrderValidator'
import RejectProfileValidator from '@Validators/RejectProfileValidator'
import StudentProfileBannerUpdateValidator from '@Validators/StudentProfileBannerUpdateValidator'
import StudentProfileCreateValidator from '@Validators/StudentProfileCreateValidator'
import StudentProfileDescriptionUpdateValidator from '@Validators/StudentProfileDescriptionUpdateValidator'
import StudentProfileMainUpdateValidator from '@Validators/StudentProfileMainUpdateValidator'
import StudentProfilePhotoUpdateValidator from '@Validators/StudentProfilePhotoUpdateValidator'
import StudentProfilesProfessionsAddValidator from '@Validators/StudentProfilesProfessionsAddValidator'
import StudentProfilesServicesAddValidator from '@Validators/StudentProfilesServicesAddValidator'
import UserCharterAcceptationValidator from '@Validators/UserCharterAcceptationValidator'

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
    return response.ok({ answer: isBookmarked }) // 200 OK
  }

  public async addProfessionsToStudentProfile({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfilesProfessionsAddValidator)
    await this.studentProfileService.addProfessionsToStudentProfile(
      Number(params.student_profile_id),
      data.choosen_professions
    )
    return response.status(200).send('Professions added') // 200 OK
  }

  public async addServicesToStudentProfile({ request, params, response }: HttpContextContract) {
    const data = await request.validate(StudentProfilesServicesAddValidator)
    await this.studentProfileService.addServicesToStudentProfile(
      Number(params.student_profile_id),
      data.choosen_services
    )
    return response.status(200).send('Services added') // 200 OK
  }

  public async getStudentPublicProfessions({ params, response }: HttpContextContract) {
    const studentPublicProfessions = await this.studentProfileService.getStudentPublicProfessions(
      Number(params.student_profile_id)
    )
    return response.ok(studentPublicProfessions) // 200 OK
  }

  public async getStudentPrivateProfessions({ params, response }: HttpContextContract) {
    const studentPrivateProfessions = await this.studentProfileService.getStudentPrivateProfessions(
      Number(params.student_profile_id)
    )
    return response.ok(studentPrivateProfessions) // 200 OK
  }

  public async getStudentServices({ params, response }: HttpContextContract) {
    const studentServices = await this.studentProfileService.getStudentServices(
      Number(params.student_profile_id)
    )
    return response.ok(studentServices) // 200 OK
  }

  // ACHIEVEMENTS
  public async addAchievementsToStudentProfile({ request, params, response }: HttpContextContract) {
    const data = await request.validate(AchievementAddValidator)

    const newAchievement: AchievementCreateDTO = {
      service_id: data.service_id,
      title: data.title,
      description: data.description,
      context: data.context,
      date: data.date,
      is_favorite: data.is_favorite,
    }

    const achievement = await this.studentProfileService.addAchievementsToStudentProfile(
      Number(params.student_profile_id),
      newAchievement,
      data.main_image_file,
      data.achievement_details
    )

    return response.ok(achievement) // 200 OK
  }

  public async addAchievementDetailsToAchievement({
    request,
    params,
    response,
  }: HttpContextContract) {
    const data = await request.validate(AchievementDetailsAddValidator)

    const newAchievementDetail: AchievementDetailCreateOrUpdateDTO = {
      achievementId: Number(params.achievement_id),
      type: data.type ? data.type : null,
      value: data.value,
      name: data.name ? data.name : null,
      caption: data.caption ? data.caption : null,
    }

    const achievementDetails = await this.studentProfileService.addAchievementDetailsToAchievement(
      Number(params.achievement_id),
      newAchievementDetail,
      data.achievement_details
    )
    return response.ok(achievementDetails)
  }

  public async updateAchievement({ request, params, response }: HttpContextContract) {
    const data = await request.validate(AchievementUpdateValidator)

    const achievementToUpdate: AchievementUpdateDTO = {
      service_id: data.service_id,
      title: data.title,
      description: data.description,
      context: data.context,
      date: data.date,
      is_favorite: data.is_favorite,
    }

    const updatedAchievement = await this.studentProfileService.updateAchievement(
      Number(params.achievement_id),
      achievementToUpdate,
      data.main_image_file
    )
    return response.ok(updatedAchievement) // 200 OK
  }

  public async updateAchievementDetail({ request, params, response }: HttpContextContract) {
    const data = await request.validate(AchievementDetailsUpdateValidator)

    const achievementDetailsToUpdate: AchievementDetailCreateOrUpdateDTO = {
      achievementId: Number(params.achievement_id),
      type: data.type ? data.type : null,
      value: data.value,
      name: data.name ? data.name : null,
      caption: data.caption ? data.caption : null,
    }

    const updatedAchievementDetail = await this.studentProfileService.updateAchievementDetail(
      Number(params.achievement_detail_id),
      achievementDetailsToUpdate,
      data.file
    )
    return response.ok(updatedAchievementDetail)
  }

  public async deleteAchievement({ params, response }: HttpContextContract) {
    await this.studentProfileService.deleteAchievement(Number(params.achievement_id))
    return response.status(204).send('Achievement deleted') // 200 OK
  }

  public async deleteAchievementDetail({ params, response }: HttpContextContract) {
    await this.studentProfileService.deleteAchievementDetail(Number(params.achievement_detail_id))
    return response.status(204).send('Achievement detail deleted') // 200 OK
  }

  public async updateAchievementsOrder({ request, response }: HttpContextContract) {
    const data = await request.validate(AchievementUpdateOrderValidator)
    await this.studentProfileService.updateAchievementsOrder(data.achievements)
    return response.status(204).send('Achievements order updated')
  }

  public async updateAchievementDetailsOrder({ request, response }: HttpContextContract) {
    const data = await request.validate(AchievementDetailsUpdateOrderValidator)
    await this.studentProfileService.updateAchievementDetailsOrder(data.achievement_details)
    return response.status(204).send('Achievement details order updated')
  }

  // PROFILE VALIDATION
  public async askProfileValidation({ params, response }: HttpContextContract) {
    await this.studentProfileService.askProfileValidation(Number(params.student_profile_id))
    return response.status(200).send('Profile validation asked') // 200 OK
  }

  public async validateProfile({ params, response }: HttpContextContract) {
    await this.studentProfileService.validateProfile(Number(params.student_profile_id))
    return response.status(200).send('Profile validated') // 200 OK
  }

  public async getValidationRequests({ response }: HttpContextContract) {
    const validationRequests = await this.studentProfileService.getValidationRequests()
    return response.ok(validationRequests) // 200 OK
  }

  public async rejectProfileValidation({ request, params, response }: HttpContextContract) {
    const data = await request.validate(RejectProfileValidator)

    await this.studentProfileService.rejectProfileValidation(
      Number(params.student_profile_id),
      data.comment
    )
    return response.status(200).send('Profile validation rejected') // 200 OK
  }
}
