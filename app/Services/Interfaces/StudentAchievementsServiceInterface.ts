// ADONIS
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// DTO
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
import AchievementUpdateOrderDTO from '@DTO/AchievementsUpdateOrderDTO'
import AchievementDetailUpdateOrderDTO from '@DTO/AchievementDetailsUpdateOrderDTO'
// MODELS
import Achievement from '@Models/Achievement'
import AchievementDetail from '@Models/AchievementDetail'

export default interface StudentAchievementsServiceInterface {
  addAchievementsToStudentProfile(
    studentProfileId: number,
    achievement: AchievementCreateDTO,
    main_image_file: MultipartFileContract | null,
    achievement_details: MultipartFileContract[] | [] | null
  ): Promise<{
    achievement: Achievement
    details: AchievementDetail[]
  }>

  addAchievementDetailsToAchievement(
    achievementId: number,
    data: AchievementDetailCreateOrUpdateDTO,
    achievement_details: MultipartFileContract[] | null
  ): Promise<AchievementDetail[]>

  updateAchievement(
    achievementId: number,
    data: AchievementCreateDTO,
    main_image_file: MultipartFileContract | null
  ): Promise<Achievement>

  updateAchievementDetail(
    achievementDetailId: number,
    data: AchievementDetailCreateOrUpdateDTO,
    file: MultipartFileContract | null
  ): Promise<AchievementDetail>

  deleteAchievement(achievementId: number): Promise<void>
  deleteAchievementDetail(achievementDetailId: number): Promise<void>
  updateAchievementsOrder(reorderedAchievements: AchievementUpdateOrderDTO[]): Promise<Boolean>
  updateAchievementDetailsOrder(
    reorderedAchievementDetails: AchievementDetailUpdateOrderDTO[]
  ): Promise<Boolean>
}
