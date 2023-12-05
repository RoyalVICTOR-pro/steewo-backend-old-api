export interface ServiceCreateOrUpdateDTO {
  name: string
  short_name: string
  picto_file?: string | null
  image_file?: string | null
  is_enabled?: boolean
  profession_id: number
}
