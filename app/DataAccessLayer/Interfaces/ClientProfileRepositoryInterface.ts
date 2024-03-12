import ClientProfile from '@Models/ClientProfile'
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'
import ClientProfileDescriptionUpdateDTO from '@DTO/ClientProfileDescriptionUpdateDTO'
import ClientProfileMainUpdateDTO from '@DTO/ClientProfileMainUpdateDTO'
import ClientProfilePhotoUpdateDTO from '@DTO/ClientProfilePhotoUpdateDTO'

export default interface ClientProfileRepositoryInterface {
  createClientProfile(data: ClientProfileCreateDTO): Promise<ClientProfile>
  getClientProfileByEmail(email: string): Promise<ClientProfile | null>
  getClientProfileByUserId(userId: number): Promise<ClientProfile | null>
  updateClientProfileMainInfo(
    userId: number,
    data: ClientProfileMainUpdateDTO
  ): Promise<ClientProfile>
  updateClientProfilePhoto(
    userId: number,
    data: ClientProfilePhotoUpdateDTO
  ): Promise<ClientProfile>
  updateClientProfileDescription(
    userId: number,
    data: ClientProfileDescriptionUpdateDTO
  ): Promise<ClientProfile>
}
