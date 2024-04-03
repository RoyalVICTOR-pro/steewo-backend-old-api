import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddServiceToMissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    service_id: schema.number(),
    serviceInfos: schema.array().members(
      schema.object().members({
        service_form_field_id: schema.number(),
        label: schema.string.optional(),
        file_caption: schema.string.optional(),
        // TODO : modifier le validator car la value peut être un file
        value: schema.string(),
      })
    ),
  })

  public messages: CustomMessages = {
    'serviceId.required': 'Le service est requis.',
    'serviceInfos.required': 'Les informations du service sont requises.',
    'serviceInfos.*.serviceFormFieldsId.required': "L'identifiant du champ est requis.",
    'serviceInfos.*.value.required': 'La valeur du champ est requise.',
  }
}
