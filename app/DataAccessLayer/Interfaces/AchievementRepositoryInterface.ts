// DTO
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
import AchievementUpdateDTO from '@DTO/AchievementUpdateDTO'
import AchievementsUpdateOrderDTO from '@DTO/AchievementsUpdateOrderDTO'
import AchievementDetailsUpdateOrderDTO from '@DTO/AchievementDetailsUpdateOrderDTO'
// MODELS
import Achievement from '@Models/Achievement'
import AchievementDetail from '@Models/AchievementDetail'

export default interface AchievementRepositoryInterface {
  addAchievementToStudentProfile(
    studentProfileId: number,
    data: AchievementCreateDTO
  ): Promise<Achievement>

  addAchievementDetailToAchievement(
    data: AchievementDetailCreateOrUpdateDTO
  ): Promise<AchievementDetail>

  getAchievementsByStudentProfileId(studentProfileId: number): Promise<Achievement[]>

  updateAchievement(achievementId: number, data: AchievementUpdateDTO): Promise<Achievement>

  deleteAchievement(achievementId: number): Promise<void>

  deleteAchievementDetail(achievementDetailId: number): Promise<void>

  updateAchievementDetail(
    achievementDetailId: number,
    data: AchievementDetailCreateOrUpdateDTO
  ): Promise<AchievementDetail>

  getAchievementDetailById(achievementId: number): Promise<AchievementDetail>

  getAchievementById(achievementId: number): Promise<Achievement>

  updateAchievementsOrder(reorderedAchievements: AchievementsUpdateOrderDTO[]): Promise<Boolean>

  updateAchievementDetailsOrder(
    reorderedAchievementDetails: AchievementDetailsUpdateOrderDTO[]
  ): Promise<Boolean>
}
