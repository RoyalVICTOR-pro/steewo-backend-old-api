// MODELS
import Profession from '@Models/Profession'
import Service from '@Models/Service'

export default interface StudentProfessionsAndServicesServiceInterface {
  addProfessionsToStudentProfile(studentProfileId: number, professions: number[]): Promise<void>
  addServicesToStudentProfile(studentProfileId: number, services: number[]): Promise<void>
  getStudentPublicProfessions(studentProfileId: number): Promise<Profession[]>
  getStudentPrivateProfessions(studentProfileId: number): Promise<Profession[]>
  getStudentPublicServices(studentProfileId: number): Promise<Service[]>
  getStudentPrivateServices(studentProfileId: number): Promise<Service[]>
}
