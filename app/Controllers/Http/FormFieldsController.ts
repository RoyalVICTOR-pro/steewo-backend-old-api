import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormFieldCreateOrUpdateDTO from '@DTO/FormFieldCreateOrUpdateDTO'
import FormFieldCreateOrUpdateValidator from '@Validators/FormFieldCreateOrUpdateValidator'
import FormFieldService from '@Services/FormFieldService'
import FormFieldUpdateOrderDTO from '@DTO/FormFieldUpdateOrderDTO'

@inject()
export default class FormFieldController {
  private formFieldService: FormFieldService
  constructor(formFieldService: FormFieldService) {
    this.formFieldService = formFieldService
  }

  public async getAllFormFieldsByService({ response, params }: HttpContextContract) {
    const formFields = await this.formFieldService.listFormFieldsByService(params.id_service)
    return response.ok(formFields)
  }

  public async getFormFieldById({ response, params }: HttpContextContract) {
    const formFields = await this.formFieldService.getFormFieldById(params.id)
    return response.ok(formFields)
  }

  public async createFormField({ request, response, params }: HttpContextContract) {
    const data = await request.validate(FormFieldCreateOrUpdateValidator)

    const newFormField: FormFieldCreateOrUpdateDTO = {
      description: data.description,
      label: data.label,
      mandatory: data.mandatory,
      placeholder: data.placeholder,
      possible_values: data.possible_values,
      service_id: params.id_service,
      tooltip_text: data.tooltip_text,
      type: data.type,
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
      description: data.description,
      label: data.label,
      mandatory: data.mandatory,
      placeholder: data.placeholder,
      possible_values: data.possible_values,
      service_id: params.id_service,
      tooltip_text: data.tooltip_text,
      type: data.type,
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
      request.body().formFields as FormFieldUpdateOrderDTO[]
    )
    return response.noContent()
  }

  public async deleteFormFieldTooltipImage({ response, params }: HttpContextContract) {
    await this.formFieldService.deleteFormFieldTooltipImage(params.id)
    return response.noContent()
  }

  public async deleteFormField({ response, params }: HttpContextContract) {
    await this.formFieldService.deleteFormField(params.id)
    return response.noContent()
  }
}
