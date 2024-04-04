// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import AddServiceInfoToMissionDTO from 'App/DataAccessLayer/DTO/AddServiceInfoToMissionDTO'
import MissionCreateDTO from 'App/DataAccessLayer/DTO/MissionCreateDTO'
// MODELS
import Mission from '@Models/Mission'
import MissionsHasService from '@Models/MissionsHasService'

@inject()
export default class MissionRepository {
  public async createMission(data: MissionCreateDTO): Promise<Mission> {
    const mission = new Mission()
    mission.merge(data)
    await mission.save()
    return mission
  }

  public async addServiceToMission(missionId: number, serviceId: number): Promise<number> {
    const mission = await Mission.findOrFail(missionId)
    await mission.related('services').attach([serviceId])
    return mission.id
  }

  public async addServiceInfoToMission(
    missionHasServiceId: number,
    serviceInfo: AddServiceInfoToMissionDTO
  ): Promise<void> {
    const missionHasService = await MissionsHasService.findOrFail(missionHasServiceId)
    await missionHasService.related('infos').create(serviceInfo)
  }
}
