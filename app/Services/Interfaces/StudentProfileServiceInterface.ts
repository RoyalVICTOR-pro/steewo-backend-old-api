// ADONIS
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// DTO
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
import AchievementUpdateOrderDTO from '@DTO/AchievementsUpdateOrderDTO'
import AchievementDetailUpdateOrderDTO from '@DTO/AchievementDetailsUpdateOrderDTO'
// MODELS
import Achievement from '@Models/Achievement'
import AchievementDetail from '@Models/AchievementDetail'
import Profession from '@Models/Profession'
import Service from '@Models/Service'
import StudentProfile from '@Models/StudentProfile'
import User from '@Models/User'

export default interface StudentProfileServiceInterface {
  createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile>
  getStudentPublicProfile(user_id: number): Promise<any>
  getStudentPrivateProfile(user_id: number): Promise<any>
  updateStudentProfileMainInfo(
    userId: number,
    data: StudentProfileMainUpdateDTO
  ): Promise<StudentProfile>
  updateStudentProfileDescription(userId: number, description: string): Promise<StudentProfile>
  updateStudentProfilePhoto(
    userId: number,
    photo_file: MultipartFileContract | null
  ): Promise<StudentProfile>
  updateStudentProfileBanner(
    userId: number,
    banner_file: MultipartFileContract | null
  ): Promise<StudentProfile>
  acceptStudentCharter(userId: number): Promise<User>
  deleteStudentProfilePhoto(studentProfileId: number): Promise<void>
  deleteStudentProfileBanner(studentProfileId: number): Promise<void>
  getStudentViewsCount(userId: number): Promise<number>
  getStudentBookmarksCount(userId: number): Promise<number>
  toggleStudentProfileBookmark(studentProfileId: number, clientProfileId: number): Promise<boolean>
  isStudentProfileBookmarked(studentProfileId: number, clientProfileId: number): Promise<boolean>
  addProfessionsToStudentProfile(studentProfileId: number, professions: number[]): Promise<void>
  addServicesToStudentProfile(studentProfileId: number, services: number[]): Promise<void>
  getStudentPublicProfessions(studentProfileId: number): Promise<Profession[]>
  getStudentPrivateProfessions(studentProfileId: number): Promise<Profession[]>
  getStudentPublicServices(studentProfileId: number): Promise<Service[]>
  getStudentPrivateServices(studentProfileId: number): Promise<Service[]>
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
