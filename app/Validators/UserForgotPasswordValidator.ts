import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.required(), rules.email()]),
  })

  public messages: CustomMessages = {
    'email.required': "L'adresse e-mail est requise.",
    'email.email': "L'adresse e-mail doit être une adresse e-mail valide.",
  }
}
