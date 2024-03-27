// MODELS
import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'

export default interface StudentProfileAndProfessionRelationRepositoryInterface {
  addProfessionToStudentProfile(
    studentId: number,
    professionId: number
  ): Promise<StudentProfilesHasProfessions>
  isStudentHasAlreadyThisProfession(studentId: number, professionId: number): Promise<boolean>
}
