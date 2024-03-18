import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentProfilesProfessionsAddValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    choosen_professions: schema.array().members(schema.number()),
  })

  public messages: CustomMessages = {
    'choosen_professions.required': 'Vous devez choisir au moins un métier',
  }
}
