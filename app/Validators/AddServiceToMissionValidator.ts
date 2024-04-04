import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class AddServiceToMissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    service_id: schema.number(),
    serviceInfos: schema.array().members(
      schema.object().members({
        service_form_field_id: schema.number(),
        label: schema.string.optional(),
        file_caption: schema.string.optional(),
        value: schema.string.optional(),
        file: schema.file.optional({
          size: Config.get('custom.MAX_MEDIA_FILE_SIZE'),
          extnames: [
            ...Config.get('custom.IMAGE_FILE_TYPES'),
            ...Config.get('custom.DOCUMENT_FILE_TYPES'),
            ...Config.get('custom.MEDIA_FILE_TYPES'),
          ],
        }),
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
