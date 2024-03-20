import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FormFieldUpdateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    formFields: schema.array().members(
      schema.object().members({
        id: schema.number(),
        order: schema.number(),
      })
    ),
  })

  public messages: CustomMessages = {
    'formFields.*.id.required': 'The form field id is required',
    'formFields.*.order.required': 'The form field order is required',
  }
}
