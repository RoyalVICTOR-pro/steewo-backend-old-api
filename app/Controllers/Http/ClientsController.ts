import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientIndividualProfileCreateValidator from '@Validators/ClientIndividualProfileCreateValidator'
import ClientProfessionalProfileCreateValidator from '@Validators/ClientProfessionalProfileCreateValidator'
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'
import ClientProfileService from '@Services/ClientProfileService'

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
}
