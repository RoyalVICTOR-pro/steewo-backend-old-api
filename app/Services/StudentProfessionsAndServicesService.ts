// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
// INTERFACES
import StudentProfessionsAndServicesServiceInterface from '@Services/Interfaces/StudentProfessionsAndServicesServiceInterface'
// MODELS
import Profession from '@Models/Profession'
import Service from '@Models/Service'
// REPOSITORIES
import StudentProfileAndProfessionRelationRepository from '@DALRepositories/StudentAndProfessionRelationRepository'
import StudentProfileAndServiceRelationRepository from '@DALRepositories/StudentAndServiceRelationRepository'

@inject()
export default class StudentProfessionsAndServicesService
  implements StudentProfessionsAndServicesServiceInterface
{
  private studentProfileAndProfessionRelationRepository: StudentProfileAndProfessionRelationRepository
  private studentProfileAndServiceRelationRepository: StudentProfileAndServiceRelationRepository

  constructor(
    studentProfileAndProfessionRelationRepository: StudentProfileAndProfessionRelationRepository,
    studentProfileAndServiceRelationRepository: StudentProfileAndServiceRelationRepository
  ) {
    this.studentProfileAndProfessionRelationRepository =
      studentProfileAndProfessionRelationRepository
    this.studentProfileAndServiceRelationRepository = studentProfileAndServiceRelationRepository
  }

  public async addProfessionsToStudentProfile(studentProfileId: number, professions: number[]) {
    for (const professionId of professions) {
      // Check if profession exists
      const profession = await Profession.find(professionId)

      if (profession) {
        // Check if profession is enabled
        if (profession.is_enabled) {
          // Check if profession is not already added by the student
          if (
            !(await this.studentProfileAndProfessionRelationRepository.isStudentHasAlreadyThisProfession(
              studentProfileId,
              professionId
            ))
          ) {
            // Add profession to student profile
            await this.studentProfileAndProfessionRelationRepository.addProfessionToStudentProfile(
              studentProfileId,
              professionId
            )
          }
        } else {
          throw new Exception('Profession not enabled', 400, 'E_BAD_REQUEST')
        }
      }
    }
  }

  public async addServicesToStudentProfile(studentProfileId: number, services: number[]) {
    for (const serviceId of services) {
      // Check if service exists
      const service = await Service.find(serviceId)

      if (service) {
        // Check if service is enabled
        if (service.is_enabled) {
          // Check if service is not already added by the student
          if (
            !(await this.studentProfileAndServiceRelationRepository.isStudentHasAlreadyThisService(
              studentProfileId,
              serviceId
            ))
          ) {
            // Add service to student profile
            await this.studentProfileAndServiceRelationRepository.addServiceToStudentProfile(
              studentProfileId,
              serviceId
            )
          }
        } else {
          throw new Exception('Service not enabled', 400, 'E_BAD_REQUEST')
        }
      }
    }
  }

  public async getStudentPublicProfessions(studentProfileId: number) {
    return await this.studentProfileAndProfessionRelationRepository.getStudentPublicProfessions(
      studentProfileId
    )
  }

  public async getStudentPrivateProfessions(studentProfileId: number) {
    return await this.studentProfileAndProfessionRelationRepository.getStudentPrivateProfessions(
      studentProfileId
    )
  }

  public async getStudentPublicServices(studentProfileId: number) {
    const studentServicesRelations =
      await this.studentProfileAndServiceRelationRepository.getStudentPublicServices(
        studentProfileId
      )

    const studentServices = [] as Service[]
    for (const studentServicesRelation of studentServicesRelations) {
      studentServices.push(studentServicesRelation.service)
    }

    return studentServices
  }

  public async getStudentPrivateServices(studentProfileId: number) {
    const studentServicesRelations =
      await this.studentProfileAndServiceRelationRepository.getStudentPrivateServices(
        studentProfileId
      )

    const studentServices = [] as Service[]
    for (const studentServicesRelation of studentServicesRelations) {
      studentServices.push(studentServicesRelation.service)
    }

    return studentServices
  }
}
