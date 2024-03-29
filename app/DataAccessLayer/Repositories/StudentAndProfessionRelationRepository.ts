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

  public async acceptAllProfessionsOfAStudent(studentId: number): Promise<void> {
    await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentId)
      .update({ profession_has_been_accepted: true })
  }

  public async acceptProfessionOfAStudent(studentId: number, professionId: number): Promise<void> {
    await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentId)
      .where('profession_id', professionId)
      .update({ profession_has_been_accepted: true })
  }

  public async askNewProfessionValidation(studentProfileId: number, professionId: number) {
    const studentAndProfessionRelation = await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentProfileId)
      .where('profession_id', professionId)
      .first()
    if (studentAndProfessionRelation) {
      studentAndProfessionRelation.waiting_validation = true
      await studentAndProfessionRelation.save()
      return studentAndProfessionRelation
    }
    return null
  }

  public async getProfessionsValidationRequests(): Promise<StudentProfilesHasProfessions[]> {
    const professionsToValidate = await StudentProfilesHasProfessions.query()
      .where('waiting_validation', true)
      .preload('profession')
      .preload('studentProfile')
    return professionsToValidate
  }

  public async rejectNewProfessionValidation(studentProfileId: number, professionId: number) {
    const studentAndProfessionRelation = await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentProfileId)
      .where('profession_id', professionId)
      .first()
    if (studentAndProfessionRelation) {
      studentAndProfessionRelation.waiting_validation = false
      await studentAndProfessionRelation.save()
      return studentAndProfessionRelation
    }
    return null
  }

  public async validateNewProfession(studentProfileId: number, professionId: number) {
    const studentAndProfessionRelation = await StudentProfilesHasProfessions.query()
      .where('student_profile_id', studentProfileId)
      .where('profession_id', professionId)
      .first()
    if (studentAndProfessionRelation) {
      studentAndProfessionRelation.waiting_validation = false
      studentAndProfessionRelation.profession_has_been_accepted = true
      await studentAndProfessionRelation.save()
      return studentAndProfessionRelation
    }
    return null
  }
}
