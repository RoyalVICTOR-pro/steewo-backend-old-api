// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import MissionCreateDTO from 'App/DataAccessLayer/DTO/MissionCreateDTO'
// MODELS
import Mission from 'App/Models/Mission'

@inject()
export default class MissionRepository {
  public async createMission(data: MissionCreateDTO): Promise<Mission> {
    const mission = new Mission()
    mission.merge(data)
    await mission.save()
    return mission
  }
}
