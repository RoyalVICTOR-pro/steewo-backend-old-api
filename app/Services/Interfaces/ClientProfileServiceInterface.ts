import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import ClientProfile from '@Models/ClientProfile'
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'
import ClientProfileMainUpdateDTO from '@DTO/ClientProfileMainUpdateDTO'
import User from '@Models/User'

export default interface ClientProfileServiceInterface {
  createClientProfile(data: ClientProfileCreateDTO): Promise<ClientProfile>
  getClientPublicProfile(user_id: number): Promise<any>
  getClientPrivateProfile(user_id: number): Promise<any>
  updateClientProfileMainInfo(
    userId: number,
    data: ClientProfileMainUpdateDTO
  ): Promise<ClientProfile>
  updateClientProfilePhoto(
    userId: number,
    photo_file: MultipartFileContract | null
  ): Promise<ClientProfile>
  updateClientProfileDescription(userId: number, description: string): Promise<ClientProfile>
  acceptClientCharter(userId: number): Promise<User>
}
