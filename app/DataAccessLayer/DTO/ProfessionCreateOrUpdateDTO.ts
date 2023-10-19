export interface ProfessionCreateOrUpdateDTO {
  id?: number
  name_fr: string
  picto_path?: string | null
  image_path?: string | null
  is_enabled?: boolean
}
