// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
// DTO
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'
import ClientProfileDescriptionUpdateDTO from '@DTO/ClientProfileDescriptionUpdateDTO'
import ClientProfileMainUpdateDTO from '@DTO/ClientProfileMainUpdateDTO'
import ClientProfilePhotoUpdateDTO from '@DTO/ClientProfilePhotoUpdateDTO'
// INTERFACES
import ClientProfileRepositoryInterface from '@DALInterfaces/ClientProfileRepositoryInterface'
// MODELS
import ClientProfile from '@Models/ClientProfile'

@inject()
export default class ClientProfileRepository implements ClientProfileRepositoryInterface {
  public async createClientProfile(data: ClientProfileCreateDTO): Promise<ClientProfile> {
    const clientProfile = new ClientProfile()
    clientProfile.user_id = data.user_id
    clientProfile.firstname = data.firstname
    clientProfile.lastname = data.lastname
    clientProfile.date_of_birth = data.date_of_birth
    if (data.phone) clientProfile.phone = data.phone
    if (data.address_number) clientProfile.address_number = data.address_number
    if (data.address_road) clientProfile.address_road = data.address_road
    if (data.address_postal_code) clientProfile.address_postal_code = data.address_postal_code
    if (data.address_city) clientProfile.address_city = data.address_city
    if (data.company_name) clientProfile.company_name = data.company_name
    if (data.position) clientProfile.position = data.position
    if (data.siret_number) clientProfile.siret_number = data.siret_number
    await clientProfile.save()
    return clientProfile
  }

  public async getClientProfileByEmail(email: string): Promise<ClientProfile | null> {
    const clientProfile = await ClientProfile.findBy('email', email)
    return clientProfile
  }

  public async getClientProfileByUserId(userId: number): Promise<ClientProfile | null> {
    const clientProfile = await ClientProfile.query()
      .where('user_id', userId)
      .preload('user')
      .first()
    return clientProfile
  }

  public async updateClientProfileMainInfo(
    userId: number,
    data: ClientProfileMainUpdateDTO
  ): Promise<ClientProfile> {
    const clientProfile = await ClientProfile.findBy('user_id', userId)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    clientProfile.merge(data)
    await clientProfile.save()
    return clientProfile
  }

  public async updateClientProfilePhoto(
    userId: number,
    data: ClientProfilePhotoUpdateDTO
  ): Promise<ClientProfile> {
    const clientProfile = await ClientProfile.findBy('user_id', userId)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    clientProfile.photo_file = data.photo_file
    await clientProfile.save()
    return clientProfile
  }

  public async updateClientProfileDescription(
    userId: number,
    data: ClientProfileDescriptionUpdateDTO
  ): Promise<ClientProfile> {
    const clientProfile = await ClientProfile.findBy('user_id', userId)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    clientProfile.description = data.description
    await clientProfile.save()
    return clientProfile
  }
}
