// DTO
import StudentProfileBannerUpdateDTO from '@DTO/StudentProfileBannerUpdateDTO'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileDescriptionUpdateDTO from '@DTO/StudentProfileDescriptionUpdateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'
import StudentProfilePhotoUpdateDTO from '@DTO/StudentProfilePhotoUpdateDTO'
// MODELS
import StudentProfile from '@Models/StudentProfile'

export default interface StudentProfileRepositoryInterface {
  createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile>
  getStudentProfileByEmail(email: string): Promise<StudentProfile | null>
  getStudentProfileByUserId(userId: number): Promise<StudentProfile | null>
  updateStudentProfileMainInfo(
    userId: number,
    data: StudentProfileMainUpdateDTO
  ): Promise<StudentProfile>
  updateStudentProfileDescription(
    userId: number,
    data: StudentProfileDescriptionUpdateDTO
  ): Promise<StudentProfile>
  updateStudentProfilePhoto(
    userId: number,
    data: StudentProfilePhotoUpdateDTO
  ): Promise<StudentProfile>
  updateStudentProfileBanner(
    userId: number,
    data: StudentProfileBannerUpdateDTO
  ): Promise<StudentProfile>
}
