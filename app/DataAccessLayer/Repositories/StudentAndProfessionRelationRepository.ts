// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// INTERFACES
import StudentProfileAndProfessionRelationRepositoryInterface from '@DALInterfaces/StudentProfileAndProfessionRelationRepositoryInterface'
// MODELS
import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'
import Profession from '@Models/Profession'

@inject()
export default class StudentProfileAndProfessionRelationRepository
  implements StudentProfileAndProfessionRelationRepositoryInterface
{
  public async addProfessionToStudentProfile(
    studentId: number,
    professionId: number
  ): Promise<StudentProfilesHasProfessions> {
    const studentAndProfessionRelation = new StudentProfilesHasProfessions()
    studentAndProfessionRelation.student_profile_id = studentId
    studentAndProfessionRelation.profession_id = professionId
    await studentAndProfessionRelation.save()
    return studentAndProfessionRelation
  }

  public async isStudentHasAlreadyThisProfession(
    studentId: number,
    professionId: number
  ): Promise<boolean> {
    const studentAndProfessionRelation = await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentId)
      .where('profession_id', professionId)
      .first()
    return studentAndProfessionRelation ? true : false
  }

  public async getStudentPublicProfessions(studentId: number): Promise<Profession[]> {
    const professions = await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentId)
      .where('profession_has_been_accepted', true)
      .preload('profession')
    return professions.map((studentProfession) => studentProfession.profession)
  }

  public async getStudentPrivateProfessions(studentId: number): Promise<Profession[]> {
    const professions = await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentId)
      .preload('profession')
    return professions.map((studentProfession) => studentProfession.profession)
  }
}
