import ClientProfile from 'App/Models/ClientProfile'
import { ClientProfileCreateDTO } from '@DTO/ClientProfileCreateDTO'

export default interface ClientProfileRepositoryInterface {
  createClientProfile(data: ClientProfileCreateDTO): Promise<ClientProfile>
  getClientProfileByEmail(email: string): Promise<ClientProfile | null>
  getClientProfileById(id: number): Promise<ClientProfile | null>
}
