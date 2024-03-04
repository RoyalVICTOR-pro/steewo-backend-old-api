import StudentProfile from 'App/Models/StudentProfile'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'

export default interface StudentProfileRepositoryInterface {
  createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile>
  getStudentProfileByEmail(email: string): Promise<StudentProfile | null>
  getStudentProfileById(id: number): Promise<StudentProfile | null>
}
