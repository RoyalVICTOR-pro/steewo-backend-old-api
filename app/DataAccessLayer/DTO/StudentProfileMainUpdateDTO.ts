import Gender from 'App/Enums/Gender'
import { DateTime } from 'luxon'

export interface StudentProfileMainUpdateDTO {
  firstname: string
  lastname: string
  date_of_birth: DateTime
  mobile?: string | null
  last_diploma: string
  last_diploma_school: string
  current_diploma: string
  current_school: string
  place_of_birth?: string | null
  siret_number?: string | null
  bank_iban?: string | null
  address_number?: string | null
  address_road?: string | null
  address_postal_code?: string | null
  address_city?: string | null
  gender: Gender
  job_title?: string | null
  school_certificate_file?: string | null
  company_exists_proof_file?: string | null
}
