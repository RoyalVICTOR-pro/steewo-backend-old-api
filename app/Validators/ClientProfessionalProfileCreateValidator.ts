import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from '@Enums/Roles'
import ClientUserStatus from '@Enums/ClientUserStatus'

export default class ClientProfessionalProfileCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.required()]),
    role: schema.enum([Role.CLIENT_PROFESSIONAL], [rules.required()]),
    status: schema.enum([ClientUserStatus.ACCOUNT_CREATED], [rules.required()]),
    firstname: schema.string({}, [rules.required()]),
    lastname: schema.string({}, [rules.required()]),
    date_of_birth: schema.date({
      format: 'yyyy-MM-dd',
    }),
    phone: schema.string.optional(),
    company_name: schema.string({}, [rules.required()]),
    position: schema.string({}, [rules.required()]),
    siret_number: schema.string({}, [rules.required()]),
    cgv_acceptation: schema.date(
      {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
      [rules.required()]
    ),
    privacy_acceptation: schema.date(
      {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
      [rules.required()]
    ),
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
    'address_number.required': 'Le numéro de rue est requis.',
    'address_road.required': 'Le nom de la rue est requis.',
    'address_postal_code.required': 'Le code postal est requis.',
    'address_city.required': 'La ville est requise.',
    'cgv_acceptation.required':
      'Vous devez accepter les conditions générales de vente pour vous inscrire.',
    'privacy_acceptation.required':
      'Vous devez accepter la politique de confidentialité pour vous inscrire.',
  }
}
