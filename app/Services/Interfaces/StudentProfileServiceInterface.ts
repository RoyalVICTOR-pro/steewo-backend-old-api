import StudentProfile from '@Models/StudentProfile'
import StudentProfileCreateDTO from '@DTO/StudentProfileCreateDTO'

export default interface StudentProfileServiceInterface {
  createStudentProfile(data: StudentProfileCreateDTO): Promise<StudentProfile>
}
