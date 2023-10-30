export interface FormFieldCreateOrUpdateDTO {
  service_id: number
  type: string
  label_fr: string
  mandatory: boolean
  tooltip_image_file?: string
  tooltip_text_fr?: string | null
  description_fr?: string | null
  placeholder_fr?: string | null
}
