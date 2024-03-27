// ADONIS
import { DateTime } from 'luxon'

export default interface UserUpdatePasswordDTO {
  password_reset_token_expiration_datetime: DateTime | null
  password_reset_token: string | null
  password: string
}
