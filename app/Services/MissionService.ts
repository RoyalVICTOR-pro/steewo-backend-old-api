// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import MissionCreateDTO from 'App/DataAccessLayer/DTO/MissionCreateDTO'
import AddServiceToMissionDTO from 'App/DataAccessLayer/DTO/AddServiceToMissionDTO'
// REPOSITORIS
import MissionRepository from '@DALRepositories/MissionRepository'
// SERVICES
import UploadService from '@Services/UploadService'
// UTILS
import { getDatetimeForFileName } from '@Utils/Various'

@inject()
export default class MissionService {
  private missionRepository: MissionRepository
  private readonly clientMissionPath = 'clients/missions/'
  private readonly serviceSubFolder = '/service/'

  constructor(missionRepository: MissionRepository) {
    this.missionRepository = missionRepository
  }

  public async createMission(data: MissionCreateDTO) {
    return await this.missionRepository.createMission(data)
  }

  public async addServiceToMission(data: AddServiceToMissionDTO) {
    const missionHasServiceId = await this.missionRepository.addServiceToMission(
      data.mission_id,
      data.service_id
    )

    let numberOfFiles = 0
    for (const serviceInfo of data.serviceInfos) {
      if (serviceInfo.file) {
        numberOfFiles++
        serviceInfo.value = await UploadService.uploadFileTo(
          serviceInfo.file,
          this.clientMissionPath + data.mission_id + this.serviceSubFolder,
          'service-info-' + numberOfFiles + '-' + getDatetimeForFileName()
        )
      }
      await this.missionRepository.addServiceInfoToMission(missionHasServiceId, serviceInfo)
    }
  }
}
