import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AchievementDetailsUpdateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    achievement_details: schema.array().members(
      schema.object().members({
        id: schema.number(),
        order: schema.number(),
      })
    ),
  })

  public messages: CustomMessages = {
    'achievement_details.*.id.required': "L'identifiant du détail de réalisation est requis",
    'achievement_details.*.order.required': "L'ordre du détail de réalisation est requis",
  }
}
