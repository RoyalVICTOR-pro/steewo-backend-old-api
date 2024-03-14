import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import Gender from '@Enums/Gender'

export default class StudentProfileMainUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    address_city: schema.string.optional(),
    address_number: schema.string.optional(),
    address_postal_code: schema.string.optional(),
    address_road: schema.string.optional(),
    bank_iban: schema.string.optional(),
    company_exists_proof_file: schema.file.optional({
      size: Config.get('custom.MAX_IMAGE_FILE_SIZE'),
      extnames: [
        ...Config.get('custom.IMAGE_FILE_TYPES'),
        ...Config.get('custom.DOCUMENT_FILE_TYPES'),
      ],
    }),
    current_diploma: schema.string({}, [rules.required()]),
    current_school: schema.string({}, [rules.required()]),
    date_of_birth: schema.date({
      format: 'yyyy-MM-dd',
    }),
    firstname: schema.string({}, [rules.required()]),
    job_title: schema.string.optional(),
    gender: schema.enum([Gender.FEMALE, Gender.MALE, Gender.NON_BINARY]),
    last_diploma: schema.string({}, [rules.required()]),
    last_diploma_school: schema.string({}, [rules.required()]),
    lastname: schema.string({}, [rules.required()]),
    mobile: schema.string.optional(),
    place_of_birth: schema.string.optional(),
    school_certificate_file: schema.file.optional({
      size: Config.get('custom.MAX_IMAGE_FILE_SIZE'),
      extnames: [
        ...Config.get('custom.IMAGE_FILE_TYPES'),
        ...Config.get('custom.DOCUMENT_FILE_TYPES'),
      ],
    }),
    siret_number: schema.string.optional(),
  })

  public messages: CustomMessages = {
    'company_exists_proof_file.extnames':
      "La preuve d'existence de l'entreprise doit avoir une extension de fichier valide (" +
      Config.get('custom.IMAGE_FILE_TYPES').join(',') +
      ',' +
      Config.get('custom.DOCUMENT_FILE_TYPES').join(',') +
      ').',
    'company_exists_proof_file.file':
      'Le champ "preuve d\'existence de l\'entreprise" doit être un fichier.',
    'company_exists_proof_file.size':
      "La taille de la preuve d'existence de l'entreprise ne doit pas dépasser la taille maximale autorisée (" +
      Config.get('custom.MAX_DOCUMENT_FILE_SIZE') +
      ').',
    'current_diploma.required': 'Le champ "diplôme en cours de préparation" est obligatoire.',
    'current_school.required': 'Le champ "établissement actuel" est obligatoire.',
    'date_of_birth.date': 'Le champ "date de naissance" doit être une date valide.',
    'firstname.required': 'Le champ "prénom" est obligatoire.',
    'gender.required': 'Le champ "genre" est obligatoire.',
    'last_diploma_school.required':
      'Le champ "établissement du dernier diplôme obtenu" est obligatoire.',
    'last_diploma.required': 'Le champ "dernier diplôme obtenu" est obligatoire.',
    'lastname.required': 'Le champ "nom" est obligatoire.',
    'school_certificate_file.extnames':
      'Le certificat scolaire doit avoir une extension de fichier valide (' +
      Config.get('custom.IMAGE_FILE_TYPES').join(',') +
      ',' +
      Config.get('custom.DOCUMENT_FILE_TYPES').join(',') +
      ').',
    'school_certificate_file.file': 'Le champ "certificat scolaire" doit être un fichier.',
    'school_certificate_file.size':
      'La taille du certificat scolaire ne doit pas dépasser la taille maximale autorisée (' +
      Config.get('custom.MAX_DOCUMENT_FILE_SIZE') +
      ').',
  }
}
