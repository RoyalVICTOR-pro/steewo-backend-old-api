import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AchievementUpdateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    achievements: schema.array().members(
      schema.object().members({
        id: schema.number(),
        order: schema.number(),
      })
    ),
  })

  public messages: CustomMessages = {
    'achievements.*.id.required': "L'identifiant de la réalisation est requis",
    'achievements.*.order.required': "L'ordre de la réalisation est requis",
  }
}
