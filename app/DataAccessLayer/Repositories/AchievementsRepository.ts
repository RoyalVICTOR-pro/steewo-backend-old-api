// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
import AchievementDetailsUpdateOrderDTO from '@DTO/AchievementDetailsUpdateOrderDTO'
import AchievementRepositoryInterface from '@DALInterfaces/AchievementRepositoryInterface'
import AchievementsUpdateOrderDTO from '@DTO/AchievementsUpdateOrderDTO'
import AchievementUpdateDTO from '@DTO/AchievementUpdateDTO'
// MODELS
import Achievement from '@Models/Achievement'
import AchievementDetail from '@Models/AchievementDetail'

@inject()
export default class AchievementsRepository implements AchievementRepositoryInterface {
  public async getAchievementsByStudentProfileId(studentProfileId: number): Promise<Achievement[]> {
    return Achievement.query()
      .preload('achievementDetails')
      .where('student_profile_id', studentProfileId)
      .orderBy('achievement_order', 'asc')
  }

  public async addAchievementToStudentProfile(
    studentProfileId: number,
    data: AchievementCreateDTO
  ): Promise<Achievement> {
    const highestOrder = await Achievement.query()
      .where('service_id', data.service_id)
      .where('student_profile_id', studentProfileId)
      .orderBy('achievement_order', 'desc')
      .first()

    let order: number
    if (!highestOrder) {
      order = 1
    } else {
      order = highestOrder.achievement_order + 1
    }

    const achievement = new Achievement()
    achievement.student_profile_id = studentProfileId
    achievement.service_id = data.service_id
    achievement.title = data.title
    if (data.date) achievement.date = data.date
    if (data.context) achievement.context = data.context
    if (data.description) achievement.description = data.description
    if (data.main_image_file) achievement.main_image_file = data.main_image_file
    if (data.is_favorite) achievement.is_favorite = data.is_favorite
    achievement.achievement_order = order

    await achievement.save()
    return achievement
  }

  public async addAchievementDetailToAchievement(
    data: AchievementDetailCreateOrUpdateDTO
  ): Promise<AchievementDetail> {
    const highestOrder = await AchievementDetail.query()
      .where('achievementId', data.achievementId)
      .orderBy('detail_order', 'desc')
      .first()

    let order: number
    if (!highestOrder) {
      order = 1
    } else {
      order = highestOrder.detail_order + 1
    }

    const achievementDetail = new AchievementDetail()
    achievementDetail.achievementId = data.achievementId
    achievementDetail.type = data.type
    if (data.value) achievementDetail.value = data.value
    if (data.file) achievementDetail.file = data.file
    if (data.name) achievementDetail.name = data.name
    if (data.caption) achievementDetail.caption = data.caption
    achievementDetail.detail_order = order

    await achievementDetail.save()
    return achievementDetail
  }

  public async updateAchievement(
    achievementId: number,
    data: AchievementUpdateDTO
  ): Promise<Achievement> {
    const achievement = await Achievement.findOrFail(achievementId)
    achievement.title = data.title
    if (data.date) achievement.date = data.date
    if (data.context) achievement.context = data.context
    if (data.description) achievement.description = data.description
    if (data.main_image_file) achievement.main_image_file = data.main_image_file
    if (data.is_favorite) achievement.is_favorite = data.is_favorite

    await achievement.save()
    return achievement
  }

  public async updateAchievementDetail(
    achievementDetailId: number,
    data: AchievementDetailCreateOrUpdateDTO
  ): Promise<AchievementDetail> {
    const achievementDetail = await AchievementDetail.findOrFail(achievementDetailId)
    achievementDetail.type = data.type
    if (data.value) achievementDetail.value = data.value
    if (data.file) achievementDetail.file = data.file
    if (data.name) achievementDetail.name = data.name
    if (data.caption) achievementDetail.caption = data.caption

    await achievementDetail.save()
    return achievementDetail
  }

  public async deleteAchievement(achievementId: number): Promise<void> {
    const achievement = await Achievement.findOrFail(achievementId)
    await achievement.delete()
  }

  public async deleteAchievementDetail(achievementDetailId: number): Promise<void> {
    const achievementDetail = await AchievementDetail.findOrFail(achievementDetailId)
    await achievementDetail.delete()
  }

  public async getAchievementById(achievementId: number): Promise<Achievement> {
    return Achievement.findOrFail(achievementId)
  }

  public async getAchievementDetailById(achievementDetailId: number): Promise<AchievementDetail> {
    return AchievementDetail.findOrFail(achievementDetailId)
  }

  public async updateAchievementsOrder(
    reorderedAchievements: AchievementsUpdateOrderDTO[]
  ): Promise<Boolean> {
    for (const achievement of reorderedAchievements) {
      const achievementToUpdate = await Achievement.findOrFail(achievement.id)
      achievementToUpdate.achievement_order = achievement.order
      await achievementToUpdate.save()
    }
    return true
  }

  public async updateAchievementDetailsOrder(
    reorderedAchievementDetails: AchievementDetailsUpdateOrderDTO[]
  ): Promise<Boolean> {
    for (const achievementDetail of reorderedAchievementDetails) {
      const achievementDetailToUpdate = await AchievementDetail.findOrFail(achievementDetail.id)
      achievementDetailToUpdate.detail_order = achievementDetail.order
      await achievementDetailToUpdate.save()
    }
    return true
  }
}
