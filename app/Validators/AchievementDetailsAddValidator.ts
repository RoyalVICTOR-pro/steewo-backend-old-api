import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class AchievementDetailsAddValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string.optional(),
    value: schema.string.optional(),
    name: schema.string.optional(),
    caption: schema.string.optional(),
    achievement_details: schema.array.optional().members(
      schema.file({
        size: Config.get('custom.MAX_MEDIA_FILE_SIZE'),
        extnames: [
          ...Config.get('custom.IMAGE_FILE_TYPES'),
          ...Config.get('custom.DOCUMENT_FILE_TYPES'),
          ...Config.get('custom.MEDIA_FILE_TYPES'),
        ],
      })
    ),
  })

  public messages: CustomMessages = {
    // IN FRENCH
    'file.file.size': 'La taille du fichier ne doit pas dépasser 2 Mo',
    'file.file.extname':
      'Le fichier doit avoir une extension de fichier valide (' +
      Config.get('custom.IMAGE_FILE_TYPES').join(', ') +
      ', ' +
      Config.get('custom.DOCUMENT_FILE_TYPES').join(', ') +
      ', ' +
      Config.get('custom.MEDIA_FILE_TYPES').join(', ') +
      ').',
  }
}
