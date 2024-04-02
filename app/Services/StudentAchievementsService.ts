// ADONIS
import { getDatetimeForFileName, getExtension, getFileTypeFromExtension } from '@Utils/Various'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// DTO
import AchievementCreateDTO from '@DTO/AchievementCreateDTO'
import AchievementDetailCreateOrUpdateDTO from '@DTO/AchievementDetailCreateOrUpdateDTO'
import AchievementDetailsUpdateOrderDTO from '@DTO/AchievementDetailsUpdateOrderDTO'
import AchievementsUpdateOrderDTO from '@DTO/AchievementsUpdateOrderDTO'
import AchievementUpdateDTO from '@DTO/AchievementUpdateDTO'
// INTERFACES
import StudentAchievementsServiceInterface from '@Services/Interfaces/StudentAchievementsServiceInterface'
// MODELS
import AchievementDetail from '@Models/AchievementDetail'
// REPOSITORIES
import AchievementsRepository from '@DALRepositories/AchievementsRepository'
// SERVICES
import UploadService from '@Services/UploadService'

@inject()
export default class StudentAchievementsService implements StudentAchievementsServiceInterface {
  private achievementRepository: AchievementsRepository
  private readonly studentProfilePath = 'students/profiles/'
  private readonly achievementsSubFolder = '/achievements/'

  constructor(achievementRepository: AchievementsRepository) {
    this.achievementRepository = achievementRepository
  }

  public async addAchievementsToStudentProfile(
    studentProfileId: number,
    achievement: AchievementCreateDTO,
    main_image_file: MultipartFileContract | null = null,
    achievement_details: MultipartFileContract[] | [] | null = null
  ) {
    if (main_image_file) {
      achievement.main_image_file = await UploadService.uploadFileTo(
        main_image_file,
        this.studentProfilePath + studentProfileId.toString() + this.achievementsSubFolder,
        'achievement-main-image-' + getDatetimeForFileName()
      )
    }

    const createdAchievement = await this.achievementRepository.addAchievementToStudentProfile(
      studentProfileId,
      achievement
    )

    const returnAchievement = {
      achievement: createdAchievement,
      details: [] as AchievementDetail[],
    }

    if (achievement_details) {
      for (const achievementFile of achievement_details) {
        const achievementDetailFilepath = await UploadService.uploadFileTo(
          achievementFile,
          this.studentProfilePath + studentProfileId.toString() + this.achievementsSubFolder,
          'achievement-detail-' + getDatetimeForFileName()
        )

        const newAchievementDetail: AchievementDetailCreateOrUpdateDTO = {
          achievementId: createdAchievement.id,
          type: getFileTypeFromExtension(getExtension(achievementDetailFilepath)),
          file: achievementDetailFilepath,
        }

        const achievementDetail =
          await this.achievementRepository.addAchievementDetailToAchievement(newAchievementDetail)
        returnAchievement.details.push(achievementDetail)
      }
    }

    return returnAchievement
  }

  public async addAchievementDetailsToAchievement(
    achievementId: number,
    data: AchievementDetailCreateOrUpdateDTO,
    achievement_details: MultipartFileContract[] | null = null
  ) {
    const returnAchievementDetails = [] as AchievementDetail[]
    if (achievement_details) {
      for (const achievementFile of achievement_details) {
        let newAchievementDetail: AchievementDetailCreateOrUpdateDTO

        const achievementDetailFilepath = await UploadService.uploadFileTo(
          achievementFile,
          this.studentProfilePath + achievementId.toString() + this.achievementsSubFolder,
          'achievement-detail-' + getDatetimeForFileName()
        )
        newAchievementDetail = {
          achievementId: achievementId,
          type: getFileTypeFromExtension(getExtension(achievementDetailFilepath)),
          file: achievementDetailFilepath,
          name: data.name ? data.name : null,
          caption: data.caption ? data.caption : null,
        }
        const achievementDetail =
          await this.achievementRepository.addAchievementDetailToAchievement(newAchievementDetail)
        returnAchievementDetails.push(achievementDetail)
      }
    } else {
      let newAchievementDetail = {
        achievementId: achievementId,
        type: data.type,
        value: data.value,
        name: data.name ? data.name : null,
        caption: data.caption ? data.caption : null,
      }
      const achievementDetail =
        await this.achievementRepository.addAchievementDetailToAchievement(newAchievementDetail)
      returnAchievementDetails.push(achievementDetail)
    }

    return returnAchievementDetails
  }

  public async updateAchievement(
    achievementId: number,
    data: AchievementUpdateDTO,
    main_image_file: MultipartFileContract | null = null
  ) {
    if (main_image_file) {
      data.main_image_file = await UploadService.uploadFileTo(
        main_image_file,
        this.studentProfilePath + achievementId.toString() + this.achievementsSubFolder,
        'achievement-main-image-' + getDatetimeForFileName()
      )
    }

    return await this.achievementRepository.updateAchievement(achievementId, data)
  }

  public async updateAchievementDetail(
    achievementDetailId: number,
    data: AchievementDetailCreateOrUpdateDTO,
    file: MultipartFileContract | null = null
  ) {
    if (file) {
      data.file = await UploadService.uploadFileTo(
        file,
        this.studentProfilePath + achievementDetailId.toString() + this.achievementsSubFolder,
        'achievement-detail-' + getDatetimeForFileName()
      )
      data.type = getFileTypeFromExtension(getExtension(data.file))
    }
    return await this.achievementRepository.updateAchievementDetail(achievementDetailId, data)
  }

  public async deleteAchievement(achievementId: number) {
    const achievement = await this.achievementRepository.getAchievementById(achievementId)
    if (!achievement) {
      throw new Exception('Achievement not found', 404, 'E_NOT_FOUND')
    }
    if (achievement.main_image_file) {
      await UploadService.deleteFile(achievement.main_image_file)
    }
    return await this.achievementRepository.deleteAchievement(achievementId)
  }

  public async deleteAchievementDetail(achievementDetailId: number) {
    const achievementDetail =
      await this.achievementRepository.getAchievementDetailById(achievementDetailId)
    if (!achievementDetail) {
      throw new Exception('Achievement Detail not found', 404, 'E_NOT_FOUND')
    }
    if (achievementDetail.file) {
      await UploadService.deleteFile(achievementDetail.file)
    }
    return await this.achievementRepository.deleteAchievementDetail(achievementDetailId)
  }

  public async updateAchievementsOrder(reorderedAchievements: AchievementsUpdateOrderDTO[]) {
    return await this.achievementRepository.updateAchievementsOrder(reorderedAchievements)
  }

  public async updateAchievementDetailsOrder(
    reorderedAchievementDetails: AchievementDetailsUpdateOrderDTO[]
  ) {
    return await this.achievementRepository.updateAchievementDetailsOrder(
      reorderedAchievementDetails
    )
  }
}
