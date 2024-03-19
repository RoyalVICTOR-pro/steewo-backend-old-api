import { getDatetimeForFileName } from '@Utils/Various'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import MailService from '@Services/MailService'
import Profession from 'App/Models/Profession'
import Service from 'App/Models/Service'
import StudentBookmarksService from './StudentBookmarksService'
import StudentProfileAndProfessionRelationRepository from 'App/DataAccessLayer/Repositories/StudentAndProfessionRelationRepository'
import StudentProfileAndServiceRelationRepository from 'App/DataAccessLayer/Repositories/StudentAndServiceRelationRepository'
import StudentProfileBannerUpdateDTO from '@DTO/StudentProfileBannerUpdateDTO'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileDescriptionUpdateDTO from '@DTO/StudentProfileDescriptionUpdateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import StudentProfilePhotoUpdateDTO from '@DTO/StudentProfilePhotoUpdateDTO'
import StudentProfileRepository from '@DALRepositories/StudentProfileRepository'
import StudentProfileServiceInterface from '@Services/Interfaces/StudentProfileServiceInterface'
import StudentProfileViewsService from '@Services/StudentProfileViewsService'
import StudentUserStatus from '@Enums/StudentUserStatus'
import UploadService from '@Services/UploadService'
import UserRepository from '@DALRepositories/UserRepository'

@inject()
export default class StudentProfileService implements StudentProfileServiceInterface {
  private studentProfileRepository: StudentProfileRepository
  private studentProfileAndProfessionRelationRepository: StudentProfileAndProfessionRelationRepository
  private studentProfileAndServiceRelationRepository: StudentProfileAndServiceRelationRepository
  private userRepository: UserRepository
  private readonly studentProfilePath = 'students/profiles/'

  constructor(studentProfileRepository: StudentProfileRepository) {
    this.studentProfileRepository = studentProfileRepository
    this.userRepository = new UserRepository()
    this.studentProfileAndProfessionRelationRepository =
      new StudentProfileAndProfessionRelationRepository()
    this.studentProfileAndServiceRelationRepository =
      new StudentProfileAndServiceRelationRepository()
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
    // TODO : Add professions, services, achievments to the public profile
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
    }

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
    // TODO : Add professions, services, achievments to the private profile
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
    }
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
    return await StudentProfileViewsService.countViews(studentProfile.id)
  }

  public async addViewToStudentProfile(studentProfileId: number, clientProfileId: number) {
    return await StudentProfileViewsService.addView(
      Number(studentProfileId),
      Number(clientProfileId)
    )
  }

  public async getStudentBookmarksCount(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('You are not a student', 401, 'E_UNAUTHORIZED')
    }
    return await StudentBookmarksService.countBookmarks(studentProfile.id)
  }

  public async toggleStudentProfileBookmark(studentProfileId: number, clientProfileId: number) {
    return await StudentBookmarksService.toggleBookmark(studentProfileId, clientProfileId)
  }

  public async isStudentProfileBookmarked(studentProfileId: number, clientProfileId: number) {
    return await StudentBookmarksService.isBookmarked(studentProfileId, clientProfileId)
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
    return await this.studentProfileAndServiceRelationRepository.getStudentServices(
      studentProfileId
    )
  }
}
