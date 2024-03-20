import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class AchievementDetailsAddOrUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    achievement_id: schema.number(),
    type: schema.string.optional(),
    value: schema.string.optional(),
    file: schema.file.optional({
      size: Config.get('custom.MAX_DOCUMENT_FILE_SIZE'),
      extnames: [
        ...Config.get('custom.IMAGE_FILE_TYPES'),
        ...Config.get('custom.DOCUMENT_FILE_TYPES'),
        ...Config.get('custom.MEDIA_FILE_TYPES'),
      ],
    }),
    name: schema.string.optional(),
    caption: schema.string.optional(),
  })

  public messages: CustomMessages = {
    // IN FRENCH
    'achievement_id.required': "L'identifiant de la réalisation est requis",
    'type.required': 'Le type de détail de réalisation est requis',
    'value.required': 'La valeur du détail de réalisation est requise',
    'file.file.size': 'La taille du fichier ne doit pas dépasser 2 Mo',
    'file.file.extname':
      'Le fichier doit avoir une extension de fichier valide (' +
      Config.get('custom.IMAGE_FILE_TYPES').join(', ') +
      ', ' +
      Config.get('custom.DOCUMENT_FILE_TYPES').join(', ') +
      ', ' +
      Config.get('custom.MEDIA_FILE_TYPES').join(', ') +
      ').',
    'name.required': 'Le nom du détail de réalisation est requis',
    'caption.required': 'La légende du détail de réalisation est requise',
  }
}
