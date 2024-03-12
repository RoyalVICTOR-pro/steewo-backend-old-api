export default interface ServiceCreateOrUpdateDTO {
  image_file?: string | null
  is_enabled?: boolean
  name: string
  picto_file?: string | null
  profession_id: number
  short_name: string
}
