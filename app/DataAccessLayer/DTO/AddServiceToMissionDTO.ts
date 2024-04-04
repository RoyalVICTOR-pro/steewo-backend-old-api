import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
export default interface AddServiceToMissionDTO {
  mission_id: number
  service_id: number
  serviceInfos: {
    service_form_field_id: number
    label?: string
    file_caption?: string
    value?: string
    file?: MultipartFileContract
  }[]
}
