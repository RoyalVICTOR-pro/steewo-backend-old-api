export interface FormFieldCreateOrUpdateDTO {
  service_id: number
  type: string
  label: string
  mandatory: boolean
  tooltip_image_file?: string
  tooltip_text?: string | null
  description?: string | null
  placeholder?: string | null
}
