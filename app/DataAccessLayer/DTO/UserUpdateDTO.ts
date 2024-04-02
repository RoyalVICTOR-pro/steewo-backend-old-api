// ADONIS
import { DateTime } from 'luxon'
// ENUMS
import ClientUserStatus from '@Enums/ClientUserStatus'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'

export default interface UserUpdateDTO {
  cgv_acceptation?: DateTime | null
  email_validation_token?: string | null
  has_enabled_email_notifications?: boolean
  has_accepted_steewo_charter?: boolean
  is_valid_email?: boolean
  password_reset_token_expiration_datetime?: DateTime | null
  password_reset_token?: string | null
  privacy_acceptation?: DateTime | null
  role?: Role
  status?: ClientUserStatus | StudentUserStatus
}
