import { FormFieldUpdateOrderDTO } from 'App/DataAccessLayer/DTO/FormFieldUpdateOrderDTO'
import ServicesFormField from 'App/Models/ServicesFormField'
import { FormFieldCreateOrUpdateDTO } from '@DTO/FormFieldCreateOrUpdateDTO'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export default interface FormFieldServiceInterface {
  listFormFieldsByService(serviceId: number): Promise<ServicesFormField[]>
  getFormFieldById(id: number): Promise<ServicesFormField>
  createFormField(
    data: FormFieldCreateOrUpdateDTO,
    tootlTipImageFile: MultipartFileContract | null
  ): Promise<ServicesFormField>
  updateFormFieldById(
    idToUpdate: number,
    data: FormFieldCreateOrUpdateDTO
  ): Promise<ServicesFormField>
  updateFormFieldOrder(reorderedFormFields: FormFieldUpdateOrderDTO[]): Promise<boolean>
  deleteFormField(id: number): Promise<boolean>
}
