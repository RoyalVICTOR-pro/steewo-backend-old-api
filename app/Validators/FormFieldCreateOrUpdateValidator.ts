import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FormFieldsTypes from '@Enums/FormFieldsTypes'

export default class FormFieldCreateOrUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.enum(Object.values(FormFieldsTypes), [rules.required()]),
    label_fr: schema.string({}, [rules.required()]),
    tooltip_image_file: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
    description_fr: schema.string.nullableAndOptional(),
    placeholder_fr: schema.string.nullableAndOptional(),
    tooltip_text_fr: schema.string.nullableAndOptional(),
    mandatory: schema.boolean(),
  })

  public messages: CustomMessages = {
    'label_fr.required': 'Le nom du champ est requis.',
    'label_fr.string': 'Le label doit être une chaîne de caractères.',
    'type.enum': 'Le type de champ est invalide.',
    'tooltip_image_file.file.extname':
      'Le fichier tooltip_image_file doit être au format jpg, png ou jpeg.',
    'tooltip_image_file.file.size': 'Le fichier tooltip_image_file ne doit pas dépasser 2 Mo.',
    'description_fr.string': 'La description doit être une chaîne de caractères.',
    'placeholder_fr.string': 'Le placeholder doit être une chaîne de caractères.',
    'tooltip_text_fr.string': 'Le tooltip doit être une chaîne de caractères.',
    'mandatory.required': 'Le champ mandatory est requis.',
  }
}
