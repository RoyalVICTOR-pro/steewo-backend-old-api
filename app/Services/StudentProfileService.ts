import { StudentProfileRepository } from './../DataAccessLayer/Repositories/StudentProfileRepository'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import StudentProfileServiceInterface from '@Services/Interfaces/StudentProfileServiceInterface'
import MailService from '@Services/MailService'
import StudentUserStatus from 'App/Enums/StudentUserStatus'

@inject()
export class StudentProfileService implements StudentProfileServiceInterface {
  private studentProfileRepository: StudentProfileRepository
  private userRepository: UserRepository

  constructor(studentProfileRepository: StudentProfileRepository) {
    this.studentProfileRepository = studentProfileRepository
    this.userRepository = new UserRepository()
  }

  public async createStudentProfile(data: StudentProfileCreateDTO) {
    const fieldsOfUserToUpdate = {
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
      firstname: studentProfile.firstname,
      lastname: studentProfile.lastname,
      last_diploma: studentProfile.last_diploma,
      last_diploma_school: studentProfile.last_diploma_school,
      current_diploma: studentProfile.current_diploma,
      current_school: studentProfile.current_school,
      description: studentProfile.description,
      average_rating: studentProfile.average_rating,
      job_title: studentProfile.job_title,
      study_level: studentProfile.study_level,
      photo_file: studentProfile.photo_file,
      banner_file: studentProfile.banner_file,
    }

    return studentPublicProfile
  }
}
