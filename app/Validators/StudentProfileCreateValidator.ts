import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Enums/Roles'
import StudentUserStatus from 'App/Enums/StudentUserStatus'

export default class StudentProfileCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.required()]),
    role: schema.enum([Role.STUDENT], [rules.required()]),
    status: schema.enum([StudentUserStatus.ACCOUNT_CREATED], [rules.required()]),
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

  public messages: CustomMessages = {
    'user_id.required': "L'utilisateur est requis.",
    'role.required': 'Le rôle est requis.',
    'role.enum': 'Le rôle est invalide.',
    'status.required': 'Le statut est requis.',
    'status.enum': 'Le statut est invalide.',
    'firstname.required': 'Le prénom est requis.',
    'lastname.required': 'Le nom est requis.',
    'date_of_birth.date.format': 'La date de naissance doit être au format yyyy-MM-dd.',
    'last_diploma.required': 'Le dernier diplôme est requis.',
    'last_diploma_school.required': "L'école du dernier diplôme est requise.",
    'current_diploma.required': 'Le diplôme actuel est requis.',
    'current_school.required': "L'école actuelle est requise.",
    'cgv_acceptation.date.format':
      "La date d'acceptation des CGV doit être au format yyyy-MM-dd HH:mm:ss.",
    'privacy_acceptation.date.format':
      "La date d'acceptation de la politique de confidentialité doit être au format yyyy-MM-dd HH:mm:ss.",
  }
}
