import MissionStatus from 'App/Enums/MissionStatus'

export default interface MissionCreateDTO {
  clientProfilesId: number
  name: string
  status: MissionStatus
}
