import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfessionUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id,
  })

  public schema = schema.create({
    name_fr: schema.string({}, [
      rules.required(),
      rules.unique({
        table: 'professions',
        column: 'name_fr',
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
    'name_fr.required': 'Le nom de la profession est requis.',
    'name_fr.unique': 'Cette profession existe déjà.',
    'picto_file.file.extnames': 'Le fichier picto_file doit être au format jpg, png ou jpeg.',
    'picto_file.file.size': 'Le fichier picto_file ne doit pas dépasser 2 Mo.',
    'image_file.file.extnames': 'Le fichier image_file doit être au format jpg, png ou jpeg.',
    'image_file.file.size': 'Le fichier image_file ne doit pas dépasser 2 Mo.',
  }
}
