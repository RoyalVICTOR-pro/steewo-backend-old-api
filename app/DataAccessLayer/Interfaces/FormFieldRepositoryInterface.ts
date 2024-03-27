// DTO
import FormFieldCreateOrUpdateDTO from '@DTO/FormFieldCreateOrUpdateDTO'
import FormFieldUpdateOrderDTO from '@DTO/FormFieldUpdateOrderDTO'
// MODELS
import ServicesFormField from '@Models/ServicesFormField'

export default interface ServiceInterface {
  listFormFieldsByService(professionId: number): Promise<ServicesFormField[]>
  getFormFieldById(id: number): Promise<ServicesFormField>
  createFormField(data: FormFieldCreateOrUpdateDTO): Promise<ServicesFormField>
  updateFormFieldById(
    idToUpdate: number,
    data: FormFieldCreateOrUpdateDTO
  ): Promise<ServicesFormField>
  updateFormFieldOrder(reorderedFormFields: FormFieldUpdateOrderDTO[]): Promise<boolean>
  deleteFormFieldTooltipImage(id: number): Promise<boolean>
  deleteFormField(id: number): Promise<boolean>
}
