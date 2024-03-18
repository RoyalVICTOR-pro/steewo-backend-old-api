import { inject } from '@adonisjs/core/build/standalone'
import StudentProfilesHasServices from '@Models/StudentProfilesHasServices'
import StudentProfileAndServiceRelationRepositoryInterface from '@DALInterfaces/StudentProfileAndServiceRelationRepositoryInterface'

@inject()
export default class StudentProfileAndServiceRelationRepository
  implements StudentProfileAndServiceRelationRepositoryInterface
{
  public async addServiceToStudentProfile(
    studentId: number,
    serviceId: number
  ): Promise<StudentProfilesHasServices> {
    const studentAndServiceRelation = new StudentProfilesHasServices()
    studentAndServiceRelation.student_profile_id = studentId
    studentAndServiceRelation.service_id = serviceId
    await studentAndServiceRelation.save()
    return studentAndServiceRelation
  }

  public async isStudentHasAlreadyThisService(
    studentId: number,
    serviceId: number
  ): Promise<boolean> {
    const studentAndServiceRelation = await StudentProfilesHasServices.query()
      .where('student_profile_id', studentId)
      .where('service_id', serviceId)
      .first()
    return studentAndServiceRelation ? true : false
  }
}
