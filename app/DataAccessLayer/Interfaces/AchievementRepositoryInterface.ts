import Achievement from '@Models/Achievement'
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementDetail from '@Models/AchievementDetail'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'

export default interface AchievementRepositoryInterface {
  addAchievementToStudentProfile(
    studentProfileId: number,
    data: AchievementCreateDTO
  ): Promise<Achievement>

  addAchievementDetailToAchievement(
    data: AchievementDetailCreateOrUpdateDTO
  ): Promise<AchievementDetail>
}
