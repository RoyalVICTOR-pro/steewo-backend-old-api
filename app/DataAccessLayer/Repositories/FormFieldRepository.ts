// Générer les méthodes CRUD pour le modèle Service

import ServicesFormField from 'App/Models/ServicesFormField'
import { FormFieldCreateOrUpdateDTO } from 'App/DataAccessLayer/DTO/FormFieldCreateOrUpdateDTO'
import FormFieldRepositoryInterface from 'App/DataAccessLayer/Interfaces/FormFieldRepositoryInterface'
import { inject } from '@adonisjs/core/build/standalone'
import { FormFieldUpdateOrderDTO } from '../DTO/FormFieldUpdateOrderDTO'

@inject()
export class FormFieldRepository implements FormFieldRepositoryInterface {
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
    formField.serviceId = data.service_id
    formField.type = data.type
    formField.label_fr = data.label_fr
    formField.mandatory = data.mandatory
    formField.order = order
    if (data.tooltip_image_file !== undefined) formField.tooltipImageFile = data.tooltip_image_file
    if (data.tooltip_text_fr !== undefined) formField.tooltipText_fr = data.tooltip_text_fr
    if (data.description_fr !== undefined) formField.description_fr = data.description_fr
    if (data.placeholder_fr !== undefined) formField.placeholder_fr = data.placeholder_fr

    await formField.save()
    return formField
  }

  public async updateFormFieldById(
    idToUpdate: number,
    data: FormFieldCreateOrUpdateDTO
  ): Promise<ServicesFormField> {
    const formField = await ServicesFormField.findOrFail(idToUpdate)
    formField.type = data.type
    formField.label_fr = data.label_fr
    formField.mandatory = data.mandatory
    // Pendant les tests, je me suis rendu compte que la mise à jour ne fonctionnait pas si on envoyait une chaîne de caractères vide
    // car Adonis la considère comme undefined.J'ai donc ajouté ces conditions pour éviter ce problème.
    if (data.tooltip_image_file !== undefined) formField.tooltipImageFile = data.tooltip_image_file
    if (data.tooltip_text_fr !== undefined) formField.tooltipText_fr = data.tooltip_text_fr
    if (data.description_fr !== undefined) formField.description_fr = data.description_fr
    if (data.placeholder_fr !== undefined) formField.placeholder_fr = data.placeholder_fr
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

  public async deleteFormField(id: number): Promise<boolean> {
    const formField = await ServicesFormField.findOrFail(id)
    await formField.delete()
    return true
  }
}
