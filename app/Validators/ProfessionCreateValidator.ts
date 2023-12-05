import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfessionCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.unique({ table: 'professions', column: 'name' })]),
    picto_file: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
    image_file: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
    is_enabled: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'name.required': 'Le nom de la profession est requis.',
    'name.unique': 'Cette profession existe déjà.',
    'picto_file.file.extname': 'Le fichier picto_file doit être au format jpg, png ou jpeg.',
    'picto_file.file.size': 'Le fichier picto_file ne doit pas dépasser 2 Mo.',
    'image_file.file.extname': 'Le fichier image_file doit être au format jpg, png ou jpeg.',
    'image_file.file.size': 'Le fichier image_file ne doit pas dépasser 2 Mo.',
  }
}
