import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({}, [
      rules.required(),
      rules.minLength(8),
      rules.regex(/[a-z]/), // Au moins une minuscule
      rules.regex(/[A-Z]/), // Au moins une majuscule
      rules.regex(/[0-9]/), // Au moins un chiffre
    ]),
    password_confirmation: schema.string({}, [rules.required(), rules.confirmed('password')]),
  })

  public messages: CustomMessages = {
    'password.required': 'Le mot de passe est requis.',
    'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
    'password.regex':
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.',
    'password_confirmation.required': 'La confirmation du mot de passe est requise.',
    'password_confirmation.equals':
      'La confirmation du mot de passe ne correspond pas au mot de passe.',
    'password.confirmed': 'La confirmation du mot de passe ne correspond pas au mot de passe.',
  }
}
