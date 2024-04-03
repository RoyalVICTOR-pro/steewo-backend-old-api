import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MissionService from '@Services/MissionService'
import MissionCreateValidator from '@Validators/MissionCreateValidator'
import MissionCreateDTO from 'App/DataAccessLayer/DTO/MissionCreateDTO'
import MissionStatus from 'App/Enums/MissionStatus'

@inject()
export default class MissionsController {
  private missionService: MissionService
  constructor(missionService: MissionService) {
    this.missionService = missionService
  }

  public async createMission({ request, response }: HttpContextContract) {
    const data = await request.validate(MissionCreateValidator)

    const newMission: MissionCreateDTO = {
      clientProfilesId: request.param('client_profile_id'),
      name: data.name,
      status: MissionStatus.CREATION_IN_PROGRESS_BY_CLIENT,
    }

    const mission = await this.missionService.createMission(newMission)
    return response.created(mission)
  }
}
