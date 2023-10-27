export interface ServiceCreateOrUpdateDTO {
  name_fr: string
  short_name_fr: string
  picto_file?: string | null
  image_file?: string | null
  is_enabled?: boolean
  profession_id: number
}
