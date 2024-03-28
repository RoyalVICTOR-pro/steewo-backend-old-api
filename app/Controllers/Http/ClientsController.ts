// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// DTO
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'
import ClientProfileMainUpdateDTO from '@DTO/ClientProfileMainUpdateDTO'
// SERVICES
import ClientProfileService from '@Services/ClientProfileService'
// VALIDATORS
import ClientIndividualProfileCreateValidator from '@Validators/ClientIndividualProfileCreateValidator'
import ClientProfessionalProfileCreateValidator from '@Validators/ClientProfessionalProfileCreateValidator'
import ClientProfileDescriptionUpdateValidator from '@Validators/ClientProfileDescriptionUpdateValidator'
import ClientProfileMainUpdateValidator from '@Validators/ClientProfileMainUpdateValidator'
import ClientProfilePhotoUpdateValidator from '@Validators/ClientProfilePhotoUpdateValidator'
import UserCharterAcceptationValidator from '@Validators/UserCharterAcceptationValidator'

@inject()
export default class ClientProfilesController {
  private clientProfileService: ClientProfileService
  constructor(clientProfileService: ClientProfileService) {
    this.clientProfileService = clientProfileService
  }

  public async createIndividualClientProfile({ request, response }: HttpContextContract) {
    const data: ClientProfileCreateDTO = await request.validate(
      ClientIndividualProfileCreateValidator
    )
    const clientProfile = await this.clientProfileService.createClientProfile(data)
    return response.created(clientProfile) // 201 CREATED
  }

  public async createProfessionnalClientProfile({ request, response }: HttpContextContract) {
    const data: ClientProfileCreateDTO = await request.validate(
      ClientProfessionalProfileCreateValidator
    )
    const clientProfile = await this.clientProfileService.createClientProfile(data)
    return response.created(clientProfile) // 201 CREATED
  }

  public async getClientPublicProfile({ params, response }: HttpContextContract) {
    const clientPublicProfile = await this.clientProfileService.getClientPublicProfile(
      Number(params.user_id)
    )
    return response.ok(clientPublicProfile) // 200 OK
  }

  public async getClientPrivateProfile({ params, response }: HttpContextContract) {
    const clientPrivateProfile = await this.clientProfileService.getClientPrivateProfile(
      Number(params.user_id)
    )
    return response.ok(clientPrivateProfile) // 200 OK
  }

  public async updateClientProfileMainInfo({ request, params, response }: HttpContextContract) {
    const data = await request.validate(ClientProfileMainUpdateValidator)
    const updatedClientProfile: ClientProfileMainUpdateDTO = {
      address_city: data.address_city,
      address_number: data.address_number,
      address_postal_code: data.address_postal_code,
      address_road: data.address_road,
      bank_iban: data.bank_iban,
      date_of_birth: data.date_of_birth,
      firstname: data.firstname,
      gender: parseInt(data.gender),
      lastname: data.lastname,
      phone: data.phone,
      siret_number: data.siret_number,
    }
    const clientProfile = await this.clientProfileService.updateClientProfileMainInfo(
      Number(params.user_id),
      updatedClientProfile
    )
    return response.ok(clientProfile) // 200 OK
  }

  public async updateClientProfilePhoto({ request, params, response }: HttpContextContract) {
    const data = await request.validate(ClientProfilePhotoUpdateValidator)

    const clientProfile = await this.clientProfileService.updateClientProfilePhoto(
      Number(params.user_id),
      data.photo_file
    )
    return response.ok(clientProfile) // 200 OK
  }

  public async updateClientProfileDescription({ request, params, response }: HttpContextContract) {
    const data = await request.validate(ClientProfileDescriptionUpdateValidator)

    if (!data.description) {
      data.description = ''
    }

    const clientProfile = await this.clientProfileService.updateClientProfileDescription(
      Number(params.user_id),
      data.description
    )
    return response.ok(clientProfile) // 200 OK
  }

  public async acceptClientCharter({ request, params, response }: HttpContextContract) {
    const data = await request.validate(UserCharterAcceptationValidator)
    if (data.has_accepted_steewo_charter !== true) {
      throw new Exception('Charter not accepted', 400, 'E_BAD_REQUEST')
    }
    const updatedUser = await this.clientProfileService.acceptClientCharter(Number(params.user_id))
    return response.status(200).send(updatedUser)
  }
}
