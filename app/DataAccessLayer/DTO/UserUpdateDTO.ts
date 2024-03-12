import ClientUserStatus from '@Enums/ClientUserStatus'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
import { DateTime } from 'luxon'

export interface UserUpdateDTO {
  role?: Role
  status?: ClientUserStatus | StudentUserStatus
  privacy_acceptation?: DateTime | null
  cgv_acceptation?: DateTime | null
  is_valid_email?: boolean
  has_enabled_notifications?: boolean
  email_validation_token?: string | null
  password_reset_token?: string | null
  password_reset_token_expiration_datetime?: DateTime | null
}
