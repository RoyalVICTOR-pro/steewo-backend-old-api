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

  updateStudentProfilePhoto(
    userId: number,
    data: StudentProfilePhotoUpdateDTO
  ): Promise<StudentProfile>

  deleteStudentProfilePhoto(studentId: number): Promise<void>

  updateStudentProfileBanner(
    userId: number,
    data: StudentProfileBannerUpdateDTO
  ): Promise<StudentProfile>

  deleteStudentProfileBanner(studentId: number): Promise<void>

  updateStudentProfileDescription(
    userId: number,
    data: StudentProfileDescriptionUpdateDTO
  ): Promise<StudentProfile>

  getStudentViewsCount(studentId: number): Promise<number>

  getStudentBookmarksCount(studentId: number): Promise<number>
}
