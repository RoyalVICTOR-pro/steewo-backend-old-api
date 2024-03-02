import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentProfileCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.required()]),
    role: schema.number([rules.required()]),
    status: schema.number([rules.required()]),
    firstname: schema.string({}, [rules.required()]),
    lastname: schema.string({}, [rules.required()]),
    date_of_birth: schema.date({
      format: 'yyyy-MM-dd',
    }),
    mobile: schema.string.optional(),
    last_diploma: schema.string({}, [rules.required()]),
    last_diploma_school: schema.string({}, [rules.required()]),
    current_diploma: schema.string({}, [rules.required()]),
    current_school: schema.string({}, [rules.required()]),
    cgv_acceptation: schema.date({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
    privacy_acceptation: schema.date({
      format: 'yyyy-MM-dd HH:mm:ss',
    }),
  })

  public messages: CustomMessages = {}
}
