import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServiceStatusUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    is_enabled: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'name.required': 'Le nom du service est requis.',
    'name.unique': 'Cet service existe déjà.',
    'short_name.required': 'Le nom court du service est requis.',
    'short_name.unique': 'Le nom court de ce service existe déjà.',
    'picto_file.file.extnames': 'Le fichier picto_file doit être au format jpg, png ou jpeg.',
    'picto_file.file.size': 'Le fichier picto_file ne doit pas dépasser 2 Mo.',
    'image_file.file.extnames': 'Le fichier image_file doit être au format jpg, png ou jpeg.',
    'image_file.file.size': 'Le fichier image_file ne doit pas dépasser 2 Mo.',
  }
}
