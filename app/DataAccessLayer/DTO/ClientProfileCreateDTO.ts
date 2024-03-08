import Role from 'App/Enums/Roles'
import ClientUserStatus from 'App/Enums/ClientUserStatus'
import { DateTime } from 'luxon'

export interface ClientProfileCreateDTO {
  user_id: number
  role: Role
  status: ClientUserStatus
  firstname: string
  lastname: string
  date_of_birth: DateTime
  phone?: string | null
  address_number?: string | null
  address_road?: string | null
  address_postal_code?: string | null
  address_city?: string | null
  company_name?: string | null
  position?: string | null
  siret_number?: string | null
  privacy_acceptation: DateTime
  cgv_acceptation: DateTime
}
