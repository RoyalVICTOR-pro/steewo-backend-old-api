// ADONIS
import { DateTime } from 'luxon'
// ENUMS
import ClientUserStatus from '@Enums/ClientUserStatus'
import Role from '@Enums/Roles'

export default interface ClientProfileCreateDTO {
  address_city?: string | null
  address_number?: string | null
  address_postal_code?: string | null
  address_road?: string | null
  cgv_acceptation: DateTime
  company_name?: string | null
  date_of_birth: DateTime
  firstname: string
  lastname: string
  phone?: string | null
  position?: string | null
  privacy_acceptation: DateTime
  role: Role
  siret_number?: string | null
  status: ClientUserStatus
  user_id: number
}
