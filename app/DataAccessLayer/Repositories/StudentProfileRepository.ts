import { inject, Exception } from '@adonisjs/core/build/standalone'
import StudentProfile from '@Models/StudentProfile'
import StudentProfileBannerUpdateDTO from '@DTO/StudentProfileBannerUpdateDTO'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileDescriptionUpdateDTO from '@DTO/StudentProfileDescriptionUpdateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import StudentProfilePhotoUpdateDTO from '@DTO/StudentProfilePhotoUpdateDTO'
import StudentProfileRepositoryInterface from '@DALInterfaces/StudentProfileRepositoryInterface'

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
    studentProfile.firstname = data.firstname
    studentProfile.lastname = data.lastname
    studentProfile.date_of_birth = data.date_of_birth
    if (data.mobile) studentProfile.mobile = data.mobile
    studentProfile.last_diploma = data.last_diploma
    studentProfile.last_diploma_school = data.last_diploma_school
    studentProfile.current_diploma = data.current_diploma
    studentProfile.current_school = data.current_school
    if (data.place_of_birth) studentProfile.place_of_birth = data.place_of_birth
    if (data.siret_number) studentProfile.siret_number = data.siret_number
    if (data.bank_iban) studentProfile.bank_iban = data.bank_iban
    if (data.address_number) studentProfile.address_number = data.address_number
    if (data.address_road) studentProfile.address_road = data.address_road
    if (data.address_postal_code) studentProfile.address_postal_code = data.address_postal_code
    if (data.address_city) studentProfile.address_city = data.address_city
    studentProfile.gender = data.gender
    if (data.job_title) studentProfile.job_title = data.job_title
    if (data.school_certificate_file)
      studentProfile.school_certificate_file = data.school_certificate_file
    if (data.company_exists_proof_file)
      studentProfile.company_exists_proof_file = data.company_exists_proof_file
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
}
