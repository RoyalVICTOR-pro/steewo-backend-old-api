export interface StudentProfileCreateDTO {
  user_id: number
  firstname: string | null
  lastname: string | null
  date_of_birth: Date | null
  mobile?: string | null
  last_diploma: string | null
  last_diploma_school: string | null
  current_diploma: string | null
  current_school: string | null
  privacy_acceptation: Date | null
  cgv_acceptation: Date | null
}
