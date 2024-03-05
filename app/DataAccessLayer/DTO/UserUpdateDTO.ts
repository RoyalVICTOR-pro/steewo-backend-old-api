import ClientUserStatus from 'App/Enums/ClientUserStatus'
import Role from 'App/Enums/Roles'
import StudentUserStatus from 'App/Enums/StudentUserStatus'
import { DateTime } from 'luxon'

export interface UserUpdateDTO {
  role?: Role
  status?: ClientUserStatus | StudentUserStatus
  privacy_acceptation?: DateTime | null
  cgv_acceptation?: DateTime | null
  is_valid_email?: boolean
  has_enabled_notifications?: boolean
  email_validation_token?: string | null
}
