// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import MissionCreateDTO from 'App/DataAccessLayer/DTO/MissionCreateDTO'
// REPOSITORIS
import MissionRepository from '@DALRepositories/MissionRepository'

@inject()
export default class MissionService {
  private missionRepository: MissionRepository

  constructor(missionRepository: MissionRepository) {
    this.missionRepository = missionRepository
  }

  public async createMission(data: MissionCreateDTO) {
    return await this.missionRepository.createMission(data)
  }
}
