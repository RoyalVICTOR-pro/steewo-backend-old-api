export default interface FormFieldCreateOrUpdateDTO {
  description?: string | null
  label: string
  mandatory: boolean
  placeholder?: string | null
  possible_values?: string | null
  service_id: number
  tooltip_image_file?: string
  tooltip_text?: string | null
  type: string
}
