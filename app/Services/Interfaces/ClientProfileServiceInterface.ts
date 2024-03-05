import { ClientProfileCreateDTO } from '@DTO/ClientProfileCreateDTO'
import ClientProfile from '@Models/ClientProfile'

export default interface ClientProfileServiceInterface {
  createClientProfile(data: ClientProfileCreateDTO): Promise<ClientProfile>
}
