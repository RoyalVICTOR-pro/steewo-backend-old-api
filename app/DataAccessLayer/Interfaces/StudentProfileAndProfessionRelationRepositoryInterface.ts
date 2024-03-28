// MODELS
import Profession from '@Models/Profession'
import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'

export default interface StudentProfileAndProfessionRelationRepositoryInterface {
  addProfessionToStudentProfile(
    studentId: number,
    professionId: number
  ): Promise<StudentProfilesHasProfessions>
  isStudentHasAlreadyThisProfession(studentId: number, professionId: number): Promise<boolean>
  getStudentPublicProfessions(studentId: number): Promise<Profession[]>
  getStudentPrivateProfessions(studentId: number): Promise<Profession[]>
}
