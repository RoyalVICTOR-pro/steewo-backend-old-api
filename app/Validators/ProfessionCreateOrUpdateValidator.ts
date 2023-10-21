import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfessionCreateOrUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name_fr: schema.string({}, [
      rules.required(),
      rules.unique({ table: 'professions', column: 'name_fr' }),
    ]),
    picto_path: schema.string.optional(),
    image_path: schema.string.optional(),
    is_enabled: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'name_fr.required': 'Le nom de la profession est requis.',
    'name_fr.unique': 'Cette profession existe déjà.',
  }
}
