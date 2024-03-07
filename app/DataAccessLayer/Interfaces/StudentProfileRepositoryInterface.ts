import StudentProfile from 'App/Models/StudentProfile'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'

export default interface StudentProfileRepositoryInterface {
  createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile>
  getStudentProfileByEmail(email: string): Promise<StudentProfile | null>
  getStudentProfileByUserId(userId: number): Promise<StudentProfile | null>
}
