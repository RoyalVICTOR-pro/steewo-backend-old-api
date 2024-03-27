// ADONIS
import { DateTime } from 'luxon'
// ENUMS
import Gender from '@Enums/Gender'

export default interface ClientProfileMainUpdateDTO {
  address_city?: string | null
  address_number?: string | null
  address_postal_code?: string | null
  address_road?: string | null
  bank_iban?: string | null
  company_name?: string | null
  date_of_birth: DateTime
  firstname: string
  gender: Gender
  position?: string | null
  lastname: string
  phone?: string | null
  siret_number?: string | null
}
