import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServiceUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    name: schema.string({}, [
      rules.unique({
        table: 'services',
        column: 'name',
        whereNot: { id: this.refs.id },
      }),
    ]),
    short_name: schema.string({}, [
      rules.unique({
        table: 'services',
        column: 'short_name',
        whereNot: { id: this.refs.id },
      }),
    ]),
    picto_file: schema.file.optional({
      size: '2mb', // Limite la taille du fichier
      extnames: ['jpg', 'png', 'jpeg'], // Extensions autorisées
    }),
    image_file: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
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
