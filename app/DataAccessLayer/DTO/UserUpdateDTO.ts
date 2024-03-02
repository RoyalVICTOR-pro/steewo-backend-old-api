import ClientUserStatus from 'App/Enums/ClientUserStatus'
import Role from 'App/Enums/Roles'
import StudentUserStatus from 'App/Enums/StudentUserStatus'

export interface UserUpdateDTO {
  role?: Role
  status?: ClientUserStatus | StudentUserStatus
  privacy_acceptation?: Date | null
  cgv_acceptation?: Date | null
  is_valid_email?: boolean
  has_enabled_notifications?: boolean
}
