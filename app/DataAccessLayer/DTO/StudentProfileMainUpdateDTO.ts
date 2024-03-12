import { DateTime } from 'luxon'
import Gender from '@Enums/Gender'

export default interface StudentProfileMainUpdateDTO {
  address_city?: string | null
  address_number?: string | null
  address_postal_code?: string | null
  address_road?: string | null
  bank_iban?: string | null
  company_exists_proof_file?: string | null
  current_diploma: string
  current_school: string
  date_of_birth: DateTime
  firstname: string
  gender: Gender
  job_title?: string | null
  last_diploma_school: string
  last_diploma: string
  lastname: string
  mobile?: string | null
  place_of_birth?: string | null
  school_certificate_file?: string | null
  siret_number?: string | null
}
