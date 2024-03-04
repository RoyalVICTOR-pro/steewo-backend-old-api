import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'
import StudentProfile from '@Models/StudentProfile'

export default interface StudentProfileServiceInterface {
  createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile>
}
