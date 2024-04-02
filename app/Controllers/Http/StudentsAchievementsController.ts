// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// DTO
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementUpdateDTO from '@DTO/AchievementUpdateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
// SERVICES
import StudentAchievementsService from '@Services/StudentAchievementsService'
// VALIDATORS
import AchievementAddValidator from '@Validators/AchievementAddValidator'
import AchievementUpdateValidator from '@Validators/AchievementUpdateValidator'
import AchievementDetailsAddValidator from '@Validators/AchievementDetailsAddValidator'
import AchievementDetailsUpdateValidator from '@Validators/AchievementDetailsUpdateValidator'
import AchievementDetailsUpdateOrderValidator from '@Validators/AchievementDetailsUpdateOrderValidator'
import AchievementUpdateOrderValidator from '@Validators/AchievementUpdateOrderValidator'

@inject()
export default class StudentsAchievementsController {
  private studentAchievementsService: StudentAchievementsService
  constructor(studentAchievementsService: StudentAchievementsService) {
    this.studentAchievementsService = studentAchievementsService
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

    const achievement = await this.studentAchievementsService.addAchievementsToStudentProfile(
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

    const achievementDetails =
      await this.studentAchievementsService.addAchievementDetailsToAchievement(
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

    const updatedAchievement = await this.studentAchievementsService.updateAchievement(
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

    const updatedAchievementDetail = await this.studentAchievementsService.updateAchievementDetail(
      Number(params.achievement_detail_id),
      achievementDetailsToUpdate,
      data.file
    )
    return response.ok(updatedAchievementDetail)
  }

  public async deleteAchievement({ params, response }: HttpContextContract) {
    await this.studentAchievementsService.deleteAchievement(Number(params.achievement_id))
    return response.status(204).send('Achievement deleted') // 200 OK
  }

  public async deleteAchievementDetail({ params, response }: HttpContextContract) {
    await this.studentAchievementsService.deleteAchievementDetail(
      Number(params.achievement_detail_id)
    )
    return response.status(204).send('Achievement detail deleted') // 200 OK
  }

  public async updateAchievementsOrder({ request, response }: HttpContextContract) {
    const data = await request.validate(AchievementUpdateOrderValidator)
    await this.studentAchievementsService.updateAchievementsOrder(data.achievements)
    return response.status(204).send('Achievements order updated')
  }

  public async updateAchievementDetailsOrder({ request, response }: HttpContextContract) {
    const data = await request.validate(AchievementDetailsUpdateOrderValidator)
    await this.studentAchievementsService.updateAchievementDetailsOrder(data.achievement_details)
    return response.status(204).send('Achievement details order updated')
  }
}
