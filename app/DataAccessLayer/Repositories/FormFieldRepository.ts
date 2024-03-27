// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import FormFieldCreateOrUpdateDTO from '@DTO/FormFieldCreateOrUpdateDTO'
import FormFieldUpdateOrderDTO from '@DTO/FormFieldUpdateOrderDTO'
// INTERFACES
import FormFieldRepositoryInterface from '@DALInterfaces/FormFieldRepositoryInterface'
// MODELS
import ServicesFormField from '@Models/ServicesFormField'

@inject()
export default class FormFieldRepository implements FormFieldRepositoryInterface {
  public async listFormFieldsByService(serviceId: number): Promise<ServicesFormField[]> {
    const formFields = await ServicesFormField.query()
      .where('service_id', serviceId)
      .orderBy('order')
    return formFields
  }

  public async getFormFieldById(id: number): Promise<ServicesFormField> {
    const formField = await ServicesFormField.findOrFail(id)
    return formField
  }

  public async createFormField(data: FormFieldCreateOrUpdateDTO): Promise<ServicesFormField> {
    const highestOrder = await ServicesFormField.query()
      .where('service_id', data.service_id)
      .orderBy('order', 'desc')
      .first()

    let order: number
    if (!highestOrder) {
      order = 1
    } else {
      order = highestOrder.order + 1
    }

    const formField = new ServicesFormField()
    formField.service_id = data.service_id
    formField.type = data.type
    formField.label = data.label
    formField.mandatory = data.mandatory
    formField.order = order
    if (data.tooltip_image_file !== undefined)
      formField.tooltip_image_file = data.tooltip_image_file
    if (data.tooltip_text !== undefined) formField.tooltip_text = data.tooltip_text
    if (data.description !== undefined) formField.description = data.description
    if (data.placeholder !== undefined) formField.placeholder = data.placeholder
    if (data.possible_values !== undefined) formField.possible_values = data.possible_values

    await formField.save()
    return formField
  }

  public async updateFormFieldById(
    idToUpdate: number,
    data: FormFieldCreateOrUpdateDTO
  ): Promise<ServicesFormField> {
    const formField = await ServicesFormField.findOrFail(idToUpdate)
    // Pendant les tests, je me suis rendu compte que la mise à jour ne fonctionnait pas si on envoyait une chaîne de caractères vide
    // car Adonis la considère comme undefined.J'ai donc ajouté ces conditions pour éviter ce problème.
    formField.type = data.type
    formField.label = data.label
    formField.mandatory = data.mandatory
    if (data.tooltip_image_file !== undefined)
      formField.tooltip_image_file = data.tooltip_image_file
    if (data.tooltip_text !== undefined) formField.tooltip_text = data.tooltip_text
    if (data.description !== undefined) formField.description = data.description
    if (data.placeholder !== undefined) formField.placeholder = data.placeholder
    if (data.possible_values !== undefined) formField.possible_values = data.possible_values
    await formField.save()
    return formField
  }

  public async updateFormFieldOrder(
    reorderedFormFields: FormFieldUpdateOrderDTO[]
  ): Promise<boolean> {
    for (const formField of reorderedFormFields) {
      const formFieldToUpdate = await ServicesFormField.findOrFail(formField.id)
      formFieldToUpdate.order = formField.order
      await formFieldToUpdate.save()
    }
    return true
  }

  public async deleteFormFieldTooltipImage(id: number): Promise<boolean> {
    const formField = await ServicesFormField.findOrFail(id)
    formField.tooltip_image_file = null
    await formField.save()
    return true
  }

  public async deleteFormField(id: number): Promise<boolean> {
    const formField = await ServicesFormField.findOrFail(id)
    await formField.delete()
    return true
  }
}
