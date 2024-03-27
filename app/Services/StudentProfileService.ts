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
import StudentProfileBannerUpdateDTO from '@DTO/StudentProfileBannerUpdateDTO'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileDescriptionUpdateDTO from '@DTO/StudentProfileDescriptionUpdateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import StudentProfilePhotoUpdateDTO from '@DTO/StudentProfilePhotoUpdateDTO'
// ENUMS
import StudentUserStatus from '@Enums/StudentUserStatus'
// INTERFACES
import StudentProfileServiceInterface from '@Services/Interfaces/StudentProfileServiceInterface'
// MODELS
import Achievement from '@Models/Achievement'
import AchievementDetail from '@Models/AchievementDetail'
import Profession from '@Models/Profession'
import Service from '@Models/Service'
// REPOSITORIES
import AchievementsRepository from '@DALRepositories/AchievementsRepository'
import StudentBookmarksRepository from '@DALRepositories/BookmarkRepository'
import StudentProfileAndProfessionRelationRepository from '@DALRepositories/StudentAndProfessionRelationRepository'
import StudentProfileAndServiceRelationRepository from '@DALRepositories/StudentAndServiceRelationRepository'
import StudentProfileRepository from '@DALRepositories/StudentProfileRepository'
import StudentProfileViewRepository from '@DALRepositories/StudentProfileViewRepository'
import UserRepository from '@DALRepositories/UserRepository'
// SERVICES
import MailService from '@Services/MailService'
import UploadService from '@Services/UploadService'

@inject()
export default class StudentProfileService implements StudentProfileServiceInterface {
  private studentProfileRepository: StudentProfileRepository
  private studentProfileAndProfessionRelationRepository: StudentProfileAndProfessionRelationRepository
  private studentProfileAndServiceRelationRepository: StudentProfileAndServiceRelationRepository
  private achievementRepository: AchievementsRepository
  private userRepository: UserRepository
  private readonly studentProfilePath = 'students/profiles/'
  private readonly achievementsSubFolder = '/achievements/'

  constructor(studentProfileRepository: StudentProfileRepository) {
    this.studentProfileRepository = studentProfileRepository
    this.userRepository = new UserRepository()
    this.studentProfileAndProfessionRelationRepository =
      new StudentProfileAndProfessionRelationRepository()
    this.studentProfileAndServiceRelationRepository =
      new StudentProfileAndServiceRelationRepository()
    this.achievementRepository = new AchievementsRepository()
  }

  public async createStudentProfile(data: StudentProfileCreateDTO) {
    const fieldsOfUserToUpdate = {
      status: data.status,
      role: data.role,
      privacy_acceptation: data.privacy_acceptation,
      cgv_acceptation: data.cgv_acceptation,
    }
    const user = await this.userRepository.getUserById(data.user_id)
    if (!user) {
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }
    if (!user.email_validation_token) {
      throw new Exception('Email Validation Token not found', 404, 'E_NOT_FOUND')
    }

    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(
      data.user_id
    )
    if (studentProfile) {
      throw new Exception('Student profile already exists', 409, 'E_CONFLICT')
    }

    await MailService.sendStudentEmailVerificationMail(
      user.email,
      user.email_validation_token,
      data.firstname
    )

    await this.userRepository.updateUserData(user, fieldsOfUserToUpdate)
    return await this.studentProfileRepository.createStudentProfile(data)
  }

  public async getStudentPublicProfile(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    if (studentProfile.user.status < StudentUserStatus.ACCOUNT_VALIDATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }
    const studentPublicProfile = {
      user_id: studentProfile.user_id,
      student_id: studentProfile.id,
      firstname: studentProfile.firstname,
      lastname: studentProfile.lastname,
      last_diploma: studentProfile.last_diploma,
      last_diploma_school: studentProfile.last_diploma_school,
      current_diploma: studentProfile.current_diploma,
      current_school: studentProfile.current_school,
      description: studentProfile.description,
      average_rating: studentProfile.average_rating,
      job_title: studentProfile.job_title,
      photo_file: studentProfile.photo_file,
      banner_file: studentProfile.banner_file,
      professions: [] as Profession[],
      services: [] as Service[],
      achievements: [] as Achievement[],
    }

    studentPublicProfile.professions = await this.getStudentPublicProfessions(studentProfile.id)

    studentPublicProfile.services = await this.getStudentServices(studentProfile.id)

    studentPublicProfile.achievements =
      await this.achievementRepository.getAchievementsByStudentProfileId(studentProfile.id)

    return studentPublicProfile
  }

  public async getStudentPrivateProfile(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    if (studentProfile.user.status < StudentUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }
    const studentPrivateProfile = {
      user_id: studentProfile.user_id,
      student_id: studentProfile.id,
      firstname: studentProfile.firstname,
      lastname: studentProfile.lastname,
      date_of_birth: studentProfile.date_of_birth,
      place_of_birth: studentProfile.place_of_birth,
      mobile: studentProfile.mobile,
      last_diploma: studentProfile.last_diploma,
      last_diploma_school: studentProfile.last_diploma_school,
      current_diploma: studentProfile.current_diploma,
      current_school: studentProfile.current_school,
      description: studentProfile.description,
      siret_number: studentProfile.siret_number,
      bank_iban: studentProfile.bank_iban,
      address_number: studentProfile.address_number,
      address_road: studentProfile.address_road,
      address_postal_code: studentProfile.address_postal_code,
      address_city: studentProfile.address_city,
      gender: studentProfile.gender,
      average_rating: studentProfile.average_rating,
      job_title: studentProfile.job_title,
      photo_file: studentProfile.photo_file,
      banner_file: studentProfile.banner_file,
      school_certificate_file: studentProfile.school_certificate_file,
      company_exists_proof_file: studentProfile.company_exists_proof_file,
      professions: [] as Profession[],
      services: [] as Service[],
      achievements: [] as Achievement[],
    }

    studentPrivateProfile.professions = await this.getStudentPrivateProfessions(studentProfile.id)

    studentPrivateProfile.services = await this.getStudentServices(studentProfile.id)

    studentPrivateProfile.achievements =
      await this.achievementRepository.getAchievementsByStudentProfileId(studentProfile.id)

    return studentPrivateProfile
  }

  public async updateStudentProfileMainInfo(
    user_id: number,
    data: StudentProfileMainUpdateDTO,
    school_certificate_file: MultipartFileContract | null = null,
    company_exists_proof_file: MultipartFileContract | null = null
  ) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    if (studentProfile.user.status < StudentUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }

    if (school_certificate_file || company_exists_proof_file) {
      if (school_certificate_file) {
        data.school_certificate_file = await UploadService.uploadFileTo(
          school_certificate_file,
          this.studentProfilePath + user_id.toString() + '/',
          'school-certificate-' + getDatetimeForFileName()
        )
      }
      if (company_exists_proof_file) {
        data.company_exists_proof_file = await UploadService.uploadFileTo(
          company_exists_proof_file,
          this.studentProfilePath + user_id.toString() + '/',
          'company-proof-' + getDatetimeForFileName()
        )
      }
    }
    return await this.studentProfileRepository.updateStudentProfileMainInfo(user_id, data)
  }

  public async updateStudentProfilePhoto(
    user_id: number,
    photo_file: MultipartFileContract | null = null
  ) {
    if (!photo_file) {
      throw new Exception('You did not provide a photo file.', 400, 'E_BAD_REQUEST')
    }
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    if (studentProfile.user.status < StudentUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }

    const photoFilepath = await UploadService.uploadFileTo(
      photo_file,
      this.studentProfilePath + user_id.toString() + '/',
      'profile-photo-' + getDatetimeForFileName()
    )

    const updatedPhoto: StudentProfilePhotoUpdateDTO = {
      photo_file: photoFilepath,
    }

    return await this.studentProfileRepository.updateStudentProfilePhoto(user_id, updatedPhoto)
  }

  public async updateStudentProfileBanner(
    user_id: number,
    banner_file: MultipartFileContract | null = null
  ) {
    if (!banner_file) {
      throw new Exception('You did not provide a banner file.', 400, 'E_BAD_REQUEST')
    }
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    if (studentProfile.user.status < StudentUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }

    const bannerFilepath = await UploadService.uploadFileTo(
      banner_file,
      this.studentProfilePath + user_id.toString() + '/',
      'banner-' + getDatetimeForFileName()
    )

    const updatedBanner: StudentProfileBannerUpdateDTO = {
      banner_file: bannerFilepath,
    }

    return await this.studentProfileRepository.updateStudentProfileBanner(user_id, updatedBanner)
  }

  public async deleteStudentProfilePhoto(studentProfileId: number) {
    return await this.studentProfileRepository.deleteStudentProfilePhoto(studentProfileId)
  }

  public async deleteStudentProfileBanner(studentProfileId: number) {
    return await this.studentProfileRepository.deleteStudentProfileBanner(studentProfileId)
  }

  public async updateStudentProfileDescription(user_id: number, description: string) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    if (studentProfile.user.status < StudentUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }
    const updatedDescription: StudentProfileDescriptionUpdateDTO = {
      description: description,
    }

    return await this.studentProfileRepository.updateStudentProfileDescription(
      user_id,
      updatedDescription
    )
  }

  public async acceptStudentCharter(user_id: number) {
    const user = await this.userRepository.getUserById(user_id)
    if (!user) {
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }
    if (user.status < StudentUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }
    const updatedCharterAcceptation = {
      has_accepted_steewo_charter: true,
    }
    return await this.userRepository.updateUserData(user, updatedCharterAcceptation)
  }

  public async getStudentViewsCount(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('You are not a student', 401, 'E_UNAUTHORIZED')
    }
    const studentProfileViews = await StudentProfileViewRepository.countViews(studentProfile.id)
    return studentProfileViews
  }

  public async addViewToStudentProfile(studentProfileId: number, clientProfileId: number) {
    return await StudentProfileViewRepository.addView(
      Number(studentProfileId),
      Number(clientProfileId)
    )
  }

  public async getStudentBookmarksCount(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('You are not a student', 401, 'E_UNAUTHORIZED')
    }
    return await StudentBookmarksRepository.countBookmarks(studentProfile.id)
  }

  public async toggleStudentProfileBookmark(studentProfileId: number, clientProfileId: number) {
    return await StudentBookmarksRepository.toggleBookmark(studentProfileId, clientProfileId)
  }

  public async isStudentProfileBookmarked(studentProfileId: number, clientProfileId: number) {
    return await StudentBookmarksRepository.isBookmarked(studentProfileId, clientProfileId)
  }

  public async addProfessionsToStudentProfile(studentProfileId: number, professions: number[]) {
    for (let i = 0; i < professions.length; i++) {
      // Check if profession exists
      const profession = await Profession.find(professions[i])

      if (profession) {
        // Check if profession is enabled
        if (profession.is_enabled) {
          // Check if profession is not already added by the student
          if (
            !(await this.studentProfileAndProfessionRelationRepository.isStudentHasAlreadyThisProfession(
              studentProfileId,
              professions[i]
            ))
          ) {
            // Add profession to student profile
            await this.studentProfileAndProfessionRelationRepository.addProfessionToStudentProfile(
              studentProfileId,
              professions[i]
            )
          }
        }
      }
    }
    return
  }

  public async addServicesToStudentProfile(studentProfileId: number, services: number[]) {
    for (let i = 0; i < services.length; i++) {
      // Check if service exists
      const service = await Service.find(services[i])

      if (service) {
        // Check if service is enabled
        if (service.is_enabled) {
          // Check if service is not already added by the student
          if (
            !(await this.studentProfileAndServiceRelationRepository.isStudentHasAlreadyThisService(
              studentProfileId,
              services[i]
            ))
          ) {
            // Add service to student profile
            await this.studentProfileAndServiceRelationRepository.addServiceToStudentProfile(
              studentProfileId,
              services[i]
            )
          }
        }
      }
    }
    return
  }

  public async getStudentPublicProfessions(studentProfileId: number) {
    return await this.studentProfileAndProfessionRelationRepository.getStudentPublicProfessions(
      studentProfileId
    )
  }

  public async getStudentPrivateProfessions(studentProfileId: number) {
    return await this.studentProfileAndProfessionRelationRepository.getStudentPrivateProfessions(
      studentProfileId
    )
  }

  public async getStudentServices(studentProfileId: number) {
    const studentServicesRelations =
      await this.studentProfileAndServiceRelationRepository.getStudentServices(studentProfileId)

    const studentServices = [] as Service[]
    for (let i = 0; i < studentServicesRelations.length; i++) {
      studentServices.push(studentServicesRelations[i].service)
    }

    return studentServices
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
      for (let i = 0; i < achievement_details.length; i++) {
        const achievementDetailFilepath = await UploadService.uploadFileTo(
          achievement_details[i],
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
      for (let i = 0; i < achievement_details.length; i++) {
        let newAchievementDetail: AchievementDetailCreateOrUpdateDTO

        const achievementDetailFilepath = await UploadService.uploadFileTo(
          achievement_details[i],
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
