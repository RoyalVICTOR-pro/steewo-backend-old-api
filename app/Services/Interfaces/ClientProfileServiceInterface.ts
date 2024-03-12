import ClientProfile from '@Models/ClientProfile'
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'

export default interface ClientProfileServiceInterface {
  createClientProfile(data: ClientProfileCreateDTO): Promise<ClientProfile>
}
