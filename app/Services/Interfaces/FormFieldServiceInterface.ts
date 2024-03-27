// ADONIS
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
// DTO
import FormFieldCreateOrUpdateDTO from '@DTO/FormFieldCreateOrUpdateDTO'
import FormFieldUpdateOrderDTO from '@DTO/FormFieldUpdateOrderDTO'
// MODELS
import ServicesFormField from '@Models/ServicesFormField'

export default interface FormFieldServiceInterface {
  listFormFieldsByService(serviceId: number): Promise<ServicesFormField[]>
  getFormFieldById(id: number): Promise<ServicesFormField>
  createFormField(
    data: FormFieldCreateOrUpdateDTO,
    tooltip_image_file: MultipartFileContract | null
  ): Promise<ServicesFormField>
  updateFormFieldById(
    idToUpdate: number,
    data: FormFieldCreateOrUpdateDTO
  ): Promise<ServicesFormField>
  updateFormFieldOrder(reorderedFormFields: FormFieldUpdateOrderDTO[]): Promise<boolean>
  deleteFormFieldTooltipImage(id: number): Promise<boolean>
  deleteFormField(id: number): Promise<boolean>
}
