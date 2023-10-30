export interface FormFieldCreateOrUpdateDTO {
  service_id: number
  type: string
  label_fr: string
  mandatory: boolean
  tooltip_image_file?: string | null
  tooltip_text_fr?: string
  description_fr?: string
  placeholder_fr?: string
}
