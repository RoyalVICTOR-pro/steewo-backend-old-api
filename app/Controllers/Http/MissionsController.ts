// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// DTO
import MissionCreateDTO from '@DTO/MissionCreateDTO'
import AddServiceToMissionDTO from '@DTO/AddServiceToMissionDTO'
// ENUMS
import MissionStatus from '@Enums/MissionStatus'
// SERVICES
import MissionService from '@Services/MissionService'
// VALIDATORS
import MissionCreateValidator from '@Validators/MissionCreateValidator'
import AddServiceToMissionValidator from '@Validators/AddServiceToMissionValidator'

@inject()
export default class MissionsController {
  private missionService: MissionService
  constructor(missionService: MissionService) {
    this.missionService = missionService
  }

  public async createMission({ request, params, response }: HttpContextContract) {
    const data = await request.validate(MissionCreateValidator)

    const newMission: MissionCreateDTO = {
      clientProfilesId: params.client_profile_id,
      name: data.name,
      status: MissionStatus.CREATION_IN_PROGRESS_BY_CLIENT,
    }

    const mission = await this.missionService.createMission(newMission)
    return response.created(mission)
  }

  public async addServiceToMission({ request, params, response }: HttpContextContract) {
    const data = await request.validate(AddServiceToMissionValidator)
    // TODO : Quid des fichiers ? Les champs pouvant contenir des fichiers ou du texte, on ne peut pas les traiter de la même manière
    // TODO : Il faudra probablement créer un validator custom pour gérer le double cas de figure soit string, soit file

    const serviceForMission: AddServiceToMissionDTO = {
      mission_id: params.mission_id,
      service_id: data.service_id,
      serviceInfos: data.serviceInfos,
    }

    await this.missionService.addServiceToMission(serviceForMission)

    return response.ok('Service added to mission.')
  }
}
