import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'

export default class NotificationUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
    has_been_read: schema.boolean(),
  })

  public messages: CustomMessages = {}
}
