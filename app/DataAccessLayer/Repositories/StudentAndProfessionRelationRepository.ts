import { inject } from '@adonisjs/core/build/standalone'
import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'
import StudentProfileAndProfessionRelationRepositoryInterface from '@DALInterfaces/StudentProfileAndProfessionRelationRepositoryInterface'

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
}
