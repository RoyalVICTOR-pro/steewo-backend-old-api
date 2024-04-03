// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import MissionCreateDTO from 'App/DataAccessLayer/DTO/MissionCreateDTO'
import AddServiceToMissionDTO from 'App/DataAccessLayer/DTO/AddServiceToMissionDTO'
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

  public async addServiceToMission(data: AddServiceToMissionDTO) {
    // TODO : Créer une entrée missions_has_services et récupérer l'id de cette entrée
    // TODO : Créer autant d'entrée missions_services_infos qu'il y a de serviceInfos dans data.serviceInfos avec l'id de la mission_has_service récupéré juste au dessus et les infos du service

    return await this.missionRepository.addServiceToMission(data)
  }
}
