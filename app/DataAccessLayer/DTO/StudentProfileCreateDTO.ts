import { DateTime } from 'luxon'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'

export default interface StudentProfileCreateDTO {
  cgv_acceptation: DateTime
  current_diploma: string
  current_school: string
  date_of_birth: DateTime
  firstname: string
  last_diploma_school: string
  last_diploma: string
  lastname: string
  mobile?: string | null
  privacy_acceptation: DateTime
  role: Role
  status: StudentUserStatus
  user_id: number
}
