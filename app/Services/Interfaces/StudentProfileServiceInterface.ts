import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import StudentProfile from '@Models/StudentProfile'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'
import StudentProfileMainUpdateDTO from '@DTO/StudentProfileMainUpdateDTO'

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
}
