// ADONIS
import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// ENUMS
import ClientUserStatus from '@Enums/ClientUserStatus'
import Role from '@Enums/Roles'

export default class ClientIndividualProfileCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.required()]),
    role: schema.enum([Role.CLIENT_INDIVIDUAL], [rules.required()]),
    status: schema.enum([ClientUserStatus.ACCOUNT_CREATED], [rules.required()]),
    firstname: schema.string({}, [rules.required()]),
    lastname: schema.string({}, [rules.required()]),
    date_of_birth: schema.date({
      format: 'yyyy-MM-dd',
    }),
    phone: schema.string.optional(),
    address_number: schema.string({}, [rules.required()]),
    address_road: schema.string({}, [rules.required()]),
    address_postal_code: schema.string({}, [rules.required()]),
    address_city: schema.string({}, [rules.required()]),
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
