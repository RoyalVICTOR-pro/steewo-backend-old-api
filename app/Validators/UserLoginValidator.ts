import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserLoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.required(), rules.email()]),
    password: schema.string({}, [
      rules.required(),
      rules.minLength(8),
      rules.regex(/[a-z]/), // Au moins une minuscule
      rules.regex(/[A-Z]/), // Au moins une majuscule
      rules.regex(/[0-9]/), // Au moins un chiffre
    ]),
  })
}
