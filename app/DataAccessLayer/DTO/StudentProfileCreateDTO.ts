import Role from 'App/Enums/Roles'
import StudentUserStatus from 'App/Enums/StudentUserStatus'
import { DateTime } from 'luxon'

export interface StudentProfileCreateDTO {
  user_id: number
  role: Role
  status: StudentUserStatus
  firstname: string
  lastname: string
  date_of_birth: DateTime
  mobile?: string | null
  last_diploma: string
  last_diploma_school: string
  current_diploma: string
  current_school: string
  privacy_acceptation: DateTime
  cgv_acceptation: DateTime
}
