import Role from 'App/Enums/Roles'
import StudentUserStatus from 'App/Enums/StudentUserStatus'
import { DateTime } from 'luxon'

export interface StudentProfileCreateDTO {
  user_id: number
  role: Role
  status: StudentUserStatus
  firstname: string | null
  lastname: string | null
  date_of_birth: DateTime
  mobile?: string | null
  last_diploma: string | null
  last_diploma_school: string | null
  current_diploma: string | null
  current_school: string | null
  privacy_acceptation: DateTime | null
  cgv_acceptation: DateTime | null
}
