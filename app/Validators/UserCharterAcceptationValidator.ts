import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserCharterAcceptationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    has_accepted_steewo_charter: schema.boolean(),
  })

  public messages: CustomMessages = {
    'has_accepted_steewo_charter.boolean': 'has_accepted_steewo_charter must be a boolean',
  }
}
