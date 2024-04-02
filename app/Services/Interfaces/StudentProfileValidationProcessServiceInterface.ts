import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'

export default interface StudentProfileValidationProcessServiceInterface {
  askProfileValidation(studentProfileId: number): Promise<void>
  validateProfile(studentProfileId: number): Promise<void>
  getValidationRequests(): Promise<any>
  rejectProfileValidation(studentProfileId: number, comment: string): Promise<void>
  askNewProfessionValidation(studentProfileId: number, professionId: number): Promise<void>
  validateNewProfession(studentProfileId: number, professionId: number): Promise<void>
  rejectNewProfessionValidation(
    studentProfileId: number,
    professionId: number,
    comment: string
  ): Promise<void>
  getProfessionsValidationRequests(): Promise<StudentProfilesHasProfessions[]>
}
