import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ClientProfileService } from '@Services/ClientProfileService'
import ClientProfessionalProfileCreateValidator from '@Validators/ClientProfessionalProfileCreateValidator'
import ClientIndividualProfileCreateValidator from '@Validators/ClientIndividualProfileCreateValidator'
import { ClientProfileCreateDTO } from '@DTO/ClientProfileCreateDTO'
import { inject } from '@adonisjs/core/build/standalone'

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
}
