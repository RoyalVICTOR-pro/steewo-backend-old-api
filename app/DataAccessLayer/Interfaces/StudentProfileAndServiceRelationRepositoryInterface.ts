//MODELS
import StudentProfilesHasServices from '@Models/StudentProfilesHasServices'

export default interface StudentProfileAndServiceRelationRepositoryInterface {
  addServiceToStudentProfile(
    studentId: number,
    serviceId: number
  ): Promise<StudentProfilesHasServices>
  isStudentHasAlreadyThisService(studentId: number, serviceId: number): Promise<boolean>
  getStudentPublicServices(studentId: number): Promise<StudentProfilesHasServices[]>
  getStudentPrivateServices(studentId: number): Promise<StudentProfilesHasServices[]>
}
