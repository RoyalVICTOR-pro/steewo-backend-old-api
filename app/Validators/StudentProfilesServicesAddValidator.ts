import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentProfilesServicesAddValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    choosen_services: schema.array().members(schema.number()),
  })

  public messages: CustomMessages = {
    'choosen_services.required': 'Vous devez choisir au moins un service',
  }
}
