import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class AchievementAddOrUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    service_id: schema.number([rules.exists({ table: 'services', column: 'id' })]),
    title: schema.string([rules.minLength(5), rules.maxLength(60)]),
    description: schema.string.optional(),
    context: schema.string.optional(),
    date: schema.date.optional(),
    is_favorite: schema.boolean.optional(),
    main_image_file: schema.file({
      size: Config.get('custom.MAX_IMAGE_FILE_SIZE'),
      extnames: Config.get('custom.IMAGE_FILE_TYPES'),
    }),
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
    'service_id.required': 'Vous devez spécifier un service.',
    'title.string': 'Le titre doit être une chaîne de caractères.',
    'achievement_details.*.size':
      'La taille du fichier ne doit pas dépasser la taille maximale autorisée (' +
      Config.get('custom.MAX_DOCUMENT_FILE_SIZE') +
      ').',
    'achievement_details.*.extnames':
      'Le fichier doit avoir une extension de fichier valide (' +
      [
        ...Config.get('custom.IMAGE_FILE_TYPES'),
        ...Config.get('custom.DOCUMENT_FILE_TYPES'),
        ...Config.get('custom.MEDIA_FILE_TYPES'),
      ].join(',') +
      ').',
    'description.string': 'La description doit être une chaîne de caractères.',
    'context.string': 'Le contexte doit être une chaîne de caractères.',
    'date.date': 'La date doit être une date.',
    'is_favorite.boolean': 'La valeur de favori doit être un booléen.',
    'main_image_file.file': "Vous n'avez pas fourni de fichier image.",
    'main_image_file.size':
      "La taille de l'image ne doit pas dépasser la taille maximale autorisée (" +
      Config.get('custom.MAX_IMAGE_FILE_SIZE') +
      ').',
    'main_image_file.extnames':
      "L'image doit avoir une extension de fichier valide (" +
      Config.get('custom.IMAGE_FILE_TYPES').join(',') +
      ').',
  }
}
