import { inject } from '@adonisjs/core/build/standalone'
import StudentProfile from 'App/Models/StudentProfile'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'
import StudentProfileRepositoryInterface from '@DALInterfaces/StudentProfileRepositoryInterface'

@inject()
export class StudentProfileRepository implements StudentProfileRepositoryInterface {
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

  public async getStudentProfileById(id: number): Promise<StudentProfile | null> {
    const studentProfile = await StudentProfile.find(id)
    return studentProfile
  }
}
