import { DateTime } from 'luxon'

export interface UserUpdatePasswordDTO {
  password_reset_token: string | null
  password_reset_token_expiration_datetime: DateTime | null
  password: string
}
