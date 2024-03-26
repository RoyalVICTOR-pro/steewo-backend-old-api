import { inject } from '@adonisjs/core/build/standalone'
import Achievement from '@Models/Achievement'
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementDetail from '@Models/AchievementDetail'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
import AchievementRepositoryInterface from '@DALInterfaces/AchievementRepositoryInterface'

@inject()
export default class AchievementsRepository implements AchievementRepositoryInterface {
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
      .where('achievement_id', data.achievement_id)
      .orderBy('detail_order', 'desc')
      .first()

    let order: number
    if (!highestOrder) {
      order = 1
    } else {
      order = highestOrder.detail_order + 1
    }

    const achievementDetail = new AchievementDetail()
    achievementDetail.achievement_id = data.achievement_id
    achievementDetail.type = data.type
    if (data.value) achievementDetail.value = data.value
    if (data.file) achievementDetail.file = data.file
    if (data.name) achievementDetail.name = data.name
    if (data.caption) achievementDetail.caption = data.caption
    achievementDetail.detail_order = order

    await achievementDetail.save()
    return achievementDetail
  }
}
