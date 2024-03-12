import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class StudentProfileBannerUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    banner_file: schema.file({
      size: Config.get('custom.MAX_IMAGE_FILE_SIZE'),
      extnames: Config.get('custom.IMAGE_FILE_TYPES'),
    }),
  })

  public messages: CustomMessages = {
    'banner_file.file': "Vous n'avez pas fourni de fichier bannière.",
    'banner_file.size':
      'La taille de la bannière ne doit pas dépasser la taille maximale autorisée (' +
      Config.get('custom.MAX_IMAGE_FILE_SIZE') +
      ').',
    'banner_file.extnames':
      'La bannière doit avoir une extension de fichier valide (' +
      Config.get('custom.IMAGE_FILE_TYPES').join(',') +
      ').',
  }
}
