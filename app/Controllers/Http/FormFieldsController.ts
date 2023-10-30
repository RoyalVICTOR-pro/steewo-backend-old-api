import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FormFieldCreateOrUpdateDTO } from '@DTO/FormFieldCreateOrUpdateDTO'
import { FormFieldUpdateOrderDTO } from '@DTO/FormFieldUpdateOrderDTO'
import { FormFieldService } from 'App/Services/FormFieldService'
import FormFieldCreateOrUpdateValidator from 'App/Validators/FormFieldCreateOrUpdateValidator'

@inject()
export default class FormFieldController {
  private formFieldService: FormFieldService
  constructor(formFieldService: FormFieldService) {
    this.formFieldService = formFieldService
  }

  public async getAllFormFieldsByService({ response, params }: HttpContextContract) {
    const formFields = await this.formFieldService.listFormFieldsByService(params.id_profession)
    return response.ok(formFields)
  }

  public async getFormFieldById({ response, params }: HttpContextContract) {
    const formFields = await this.formFieldService.getFormFieldById(params.id)
    return response.ok(formFields)
  }

  public async createFormField({ request, response, params }: HttpContextContract) {
    const data = await request.validate(FormFieldCreateOrUpdateValidator)

    const newFormField: FormFieldCreateOrUpdateDTO = {
      service_id: params.id_service,
      type: data.type,
      label_fr: data.label_fr,
      mandatory: data.mandatory,
      tooltip_text_fr: data.tooltip_text_fr,
      description_fr: data.description_fr,
      placeholder_fr: data.placeholder_fr,
    }

    const formField = await this.formFieldService.createFormField(
      newFormField,
      data.tooltip_image_file
    )
    return response.created(formField)
  }

  public async updateFormField({ request, response, params }: HttpContextContract) {
    const data = await request.validate(FormFieldCreateOrUpdateValidator)
    const updatedFormField = {
      service_id: params.id_service,
      type: data.type,
      label_fr: data.label_fr,
      mandatory: data.mandatory,
      tooltip_text_fr: data.tooltip_text_fr,
      description_fr: data.description_fr,
      placeholder_fr: data.placeholder_fr,
    }

    const formField = await this.formFieldService.updateFormFieldById(
      params.id,
      updatedFormField,
      data.tooltip_image_file
    )
    return response.ok(formField)
  }

  public async updateFormFieldOrder({ request, response }: HttpContextContract) {
    await this.formFieldService.updateFormFieldOrder(
      request.input['formFields'] as FormFieldUpdateOrderDTO[]
    )
    return response.noContent()
  }

  public async deleteFormField({ response, params }: HttpContextContract) {
    await this.formFieldService.deleteFormField(params.id)
    return response.noContent()
  }
}
