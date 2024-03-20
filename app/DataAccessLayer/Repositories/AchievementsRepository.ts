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
    const achievement = new Achievement()
    achievement.title = data.title
    if (data.description) achievement.description = data.description
    if (data.context) achievement.context = data.context
    if (data.date) achievement.date = data.date
    if (data.isFavorite) achievement.isFavorite = data.isFavorite
    achievement.student_profile_id = studentProfileId

    await achievement.save()
    return achievement
  }

  public async addAchievementDetailToAchievement(
    data: AchievementDetailCreateOrUpdateDTO
  ): Promise<AchievementDetail> {
    const achievementDetail = new AchievementDetail()
    achievementDetail.achievement_id = data.achievement_id
    achievementDetail.type = data.type

    if (data.description) achievementDetail.description = data.description
    if (data.context) achievementDetail.context = data.context
    if (data.date) achievementDetail.date = data.date
    if (data.isFavorite) achievementDetail.isFavorite = data.isFavorite

    await achievementDetail.save()
    return achievementDetail
  }
}
