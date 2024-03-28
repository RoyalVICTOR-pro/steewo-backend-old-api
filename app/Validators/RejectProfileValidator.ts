import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RejectProfileValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    comment: schema.string({}, [rules.required(), rules.minLength(10), rules.maxLength(255)]),
  })

  public messages: CustomMessages = {
    'comment.required': 'Le commentaire est requis.',
    'comment.minLength': 'Le commentaire doit contenir au moins 10 caractères.',
    'comment.maxLength': 'Le commentaire ne peut pas dépasser 255 caractères.',
  }
}
