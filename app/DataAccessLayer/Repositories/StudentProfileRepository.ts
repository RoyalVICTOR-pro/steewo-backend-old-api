// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
// DTO
import StudentProfileBannerUpdateDTO from '@DTO/StudentProfileBannerUpdateDTO'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileDescriptionUpdateDTO from '@DTO/StudentProfileDescriptionUpdateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import StudentProfilePhotoUpdateDTO from '@DTO/StudentProfilePhotoUpdateDTO'
// INTERFACES
import StudentProfileRepositoryInterface from '@DALInterfaces/StudentProfileRepositoryInterface'
// MODELS
import StudentProfile from '@Models/StudentProfile'
import StudentUserStatus from '@Enums/StudentUserStatus'
import User from '@Models/User'

@inject()
export default class StudentProfileRepository implements StudentProfileRepositoryInterface {
  public async createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile> {
    const studentProfile = new StudentProfile()
    studentProfile.user_id = data.user_id
    studentProfile.firstname = data.firstname
    studentProfile.lastname = data.lastname
    studentProfile.date_of_birth = data.date_of_birth
    if (data.mobile) studentProfile.mobile = data.mobile
    studentProfile.last_diploma = data.last_diploma
    studentProfile.last_diploma_school = data.last_diploma_school
    studentProfile.current_diploma = data.current_diploma
    studentProfile.current_school = data.current_school
    await studentProfile.save()
    return studentProfile
  }

  public async getStudentProfileByEmail(email: string): Promise<StudentProfile | null> {
    const studentProfile = await StudentProfile.findBy('email', email)
    return studentProfile
  }

  public async getStudentProfileByUserId(userId: number): Promise<StudentProfile | null> {
    const studentProfile = await StudentProfile.query()
      .where('user_id', userId)
      .preload('user')
      .first()
    return studentProfile
  }

  public async updateStudentProfileMainInfo(
    userId: number,
    data: StudentProfileMainUpdateDTO
  ): Promise<StudentProfile> {
    const studentProfile = await StudentProfile.findBy('user_id', userId)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfile.merge(data)
    await studentProfile.save()
    return studentProfile
  }

  public async updateStudentProfilePhoto(
    userId: number,
    data: StudentProfilePhotoUpdateDTO
  ): Promise<StudentProfile> {
    const studentProfile = await StudentProfile.findBy('user_id', userId)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfile.photo_file = data.photo_file
    await studentProfile.save()
    return studentProfile
  }

  public async deleteStudentProfilePhoto(studentId: number): Promise<void> {
    const studentProfile = await StudentProfile.findBy('id', studentId)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfile.photo_file = null
    await studentProfile.save()
  }

  public async updateStudentProfileBanner(
    userId: number,
    data: StudentProfileBannerUpdateDTO
  ): Promise<StudentProfile> {
    const studentProfile = await StudentProfile.findBy('user_id', userId)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfile.banner_file = data.banner_file
    await studentProfile.save()
    return studentProfile
  }

  public async deleteStudentProfileBanner(studentId: number): Promise<void> {
    const studentProfile = await StudentProfile.findBy('id', studentId)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfile.banner_file = null
    await studentProfile.save()
  }

  public async updateStudentProfileDescription(
    userId: number,
    data: StudentProfileDescriptionUpdateDTO
  ): Promise<StudentProfile> {
    const studentProfile = await StudentProfile.findBy('user_id', userId)
    if (!studentProfile) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfile.description = data.description
    await studentProfile.save()
    return studentProfile
  }

  public async getStudentViewsCount(studentId: number): Promise<number> {
    const viewsCount = await Database.from('student_profile_views')
      .where('student_profile_id', studentId)
      .count('* as total')
    return viewsCount[0].total
  }

  public async getStudentBookmarksCount(studentId: number): Promise<number> {
    const bookmarksCount = await Database.from('bookmarks')
      .where('student_profile_id', studentId)
      .count('* as total')
    return bookmarksCount[0].total
  }

  public async askProfileValidation(studentProfileId: number) {
    const studentProfileUser = await User.query()
      .join('student_profiles', 'users.id', 'student_profiles.user_id')
      .where('student_profiles.id', studentProfileId)
      .first()
    if (!studentProfileUser) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfileUser.status = StudentUserStatus.ACCOUNT_VALIDATION_ASKED
    await studentProfileUser.save()
  }

  public async validateProfile(studentProfileId: number) {
    const studentProfileUser = await User.query()
      .join('student_profiles', 'users.id', 'student_profiles.user_id')
      .where('student_profiles.id', studentProfileId)
      .first()
    if (!studentProfileUser) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfileUser.status = StudentUserStatus.ACCOUNT_VALIDATED
    await studentProfileUser.save()
  }

  public async getValidationRequests() {
    const validationAskingStudentProfiles = await StudentProfile.query()
      .preload('user')
      .where('status', StudentUserStatus.ACCOUNT_VALIDATION_ASKED)
      .orderBy('updated_at', 'desc')
    return validationAskingStudentProfiles
  }

  public async rejectProfileValidation(studentProfileId: number) {
    const studentProfileUser = await User.query()
      .join('student_profiles', 'users.id', 'student_profiles.user_id')
      .where('student_profiles.id', studentProfileId)
      .first()
    if (!studentProfileUser) {
      throw new Exception('Student profile not found', 404, 'E_NOT_FOUND')
    }
    studentProfileUser.status = StudentUserStatus.ACCOUNT_CREATED
    await studentProfileUser.save()
  }
}
