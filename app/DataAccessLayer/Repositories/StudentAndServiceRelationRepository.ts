// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// INTERFACES
import StudentProfileAndServiceRelationRepositoryInterface from '@DALInterfaces/StudentProfileAndServiceRelationRepositoryInterface'
// MODELS
import StudentProfilesHasServices from '@Models/StudentProfilesHasServices'

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

  public async getStudentPublicServices(studentId: number): Promise<StudentProfilesHasServices[]> {
    const studentServices = await StudentProfilesHasServices.query()
      .select('*')
      .join('services', 'student_profiles_has_services.service_id', 'services.id')
      .join(
        'student_profiles_has_professions',
        'student_profiles_has_professions.profession_id',
        'services.profession_id'
      )
      .preload('service')
      .where('student_profiles_has_services.student_profile_id', studentId)
      .where('student_profiles_has_professions.profession_has_been_accepted', 1)

    return studentServices
  }

  public async getStudentPrivateServices(studentId: number): Promise<StudentProfilesHasServices[]> {
    const studentServices = await StudentProfilesHasServices.query()
      .select('*')
      .join('services', 'student_profiles_has_services.service_id', 'services.id')
      .join(
        'student_profiles_has_professions',
        'student_profiles_has_professions.profession_id',
        'services.profession_id'
      )
      .preload('service')
      .where('student_profiles_has_services.student_profile_id', studentId)

    return studentServices
  }

  public async acceptAllServicesOfAStudent(studentId: number): Promise<void> {
    await StudentProfilesHasServices.query()
      .where('student_profile_id', studentId)
      .update({ service_has_been_accepted: true })
  }

  public async acceptServiceOfAStudent(studentId: number, serviceId: number): Promise<void> {
    await StudentProfilesHasServices.query()
      .where('student_profile_id', studentId)
      .where('service_id', serviceId)
      .update({ service_has_been_accepted: true })
  }

  public async validateServicesOfTheNewProfession(studentProfileId: number, professionId: number) {
    // Récupérer tous les services liés à la profession par rapport à la table professions et liés au profil par rapport à la table student_profiles_has_services
    const studentServices = await StudentProfilesHasServices.query()
      .select('*')
      .join('services', 'student_profiles_has_services.service_id', 'services.id')
      .join('professions', 'professions.id', 'services.profession_id')
      .where('student_profiles_has_services.student_profile_id', studentProfileId)
      .where('professions.id', professionId)
    // Valider tous les services
    for (const studentService of studentServices) {
      studentService.service_has_been_accepted = true
      await studentService.save()
    }
  }
}
