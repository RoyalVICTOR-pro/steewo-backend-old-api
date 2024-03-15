import { getDatetimeForFileName } from '@Utils/Various'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import ClientProfileCreateDTO from '@DTO/ClientProfileCreateDTO'
import ClientProfileDescriptionUpdateDTO from '@DTO/ClientProfileDescriptionUpdateDTO'
import ClientProfileMainUpdateDTO from '@DTO/ClientProfileMainUpdateDTO'
import ClientProfilePhotoUpdateDTO from '@DTO/ClientProfilePhotoUpdateDTO'
import ClientProfileRepository from '@DALRepositories/ClientProfileRepository'
import ClientProfileServiceInterface from '@Services/Interfaces/ClientProfileServiceInterface'
import ClientUserStatus from '@Enums/ClientUserStatus'
import MailService from '@Services/MailService'
import UploadService from '@Services/UploadService'
import UserRepository from '@DALRepositories/UserRepository'

@inject()
export default class ClientProfileService implements ClientProfileServiceInterface {
  private clientProfileRepository: ClientProfileRepository
  private userRepository: UserRepository
  private readonly clientProfilePath = 'client/profiles/'

  constructor(clientProfileRepository: ClientProfileRepository) {
    this.clientProfileRepository = clientProfileRepository
    this.userRepository = new UserRepository()
  }

  public async createClientProfile(data: ClientProfileCreateDTO) {
    const fieldsOfUserToUpdate = {
      privacy_acceptation: data.privacy_acceptation,
      cgv_acceptation: data.cgv_acceptation,
    }
    const user = await this.userRepository.getUserById(data.user_id)
    if (!user) {
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }
    if (!user.email_validation_token) {
      throw new Exception('Email Validation Token not found', 404, 'E_NOT_FOUND')
    }

    const clientProfile = await this.clientProfileRepository.getClientProfileByUserId(data.user_id)
    if (clientProfile) {
      throw new Exception('Client profile already exists', 409, 'E_CONFLICT')
    }

    await MailService.sendClientEmailVerificationMail(
      user.email,
      user.email_validation_token,
      data.firstname
    )

    await this.userRepository.updateUserData(user, fieldsOfUserToUpdate)
    return await this.clientProfileRepository.createClientProfile(data)
  }

  public async getClientPublicProfile(user_id: number) {
    const clientProfile = await this.clientProfileRepository.getClientProfileByUserId(user_id)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    // TODO : Add professions, services, achievments to the public profile
    const clientPublicProfile = {
      user_id: clientProfile.user_id,
      client_id: clientProfile.id,
      firstname: clientProfile.firstname,
      lastname: clientProfile.lastname,
      phone: clientProfile.phone,
      company_name: clientProfile.company_name,
      position: clientProfile.position,
      description: clientProfile.description,
      photo_file: clientProfile.photo_file,
      average_rating: clientProfile.average_rating,
    }
    return clientPublicProfile
  }

  public async getClientPrivateProfile(user_id: number) {
    const clientProfile = await this.clientProfileRepository.getClientProfileByUserId(user_id)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    const clientPrivateProfile = {
      user_id: clientProfile.user_id,
      client_id: clientProfile.id,
      firstname: clientProfile.firstname,
      lastname: clientProfile.lastname,
      date_of_birth: clientProfile.date_of_birth,
      phone: clientProfile.phone,
      company_name: clientProfile.company_name,
      position: clientProfile.position,
      description: clientProfile.description,
      photo_file: clientProfile.photo_file,
      address_number: clientProfile.address_number,
      address_road: clientProfile.address_road,
      address_postal_code: clientProfile.address_postal_code,
      address_city: clientProfile.address_city,
      siret_number: clientProfile.siret_number,
      bank_iban: clientProfile.bank_iban,
      average_rating: clientProfile.average_rating,
    }
    return clientPrivateProfile
  }

  public async updateClientProfileMainInfo(user_id: number, data: ClientProfileMainUpdateDTO) {
    const clientProfile = await this.clientProfileRepository.getClientProfileByUserId(user_id)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    if (clientProfile.user.status < ClientUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }

    return await this.clientProfileRepository.updateClientProfileMainInfo(user_id, data)
  }

  public async updateClientProfilePhoto(
    user_id: number,
    photo_file: MultipartFileContract | null = null
  ) {
    if (!photo_file) {
      throw new Exception('You did not provide a photo file.', 400, 'E_BAD_REQUEST')
    }
    const clientProfile = await this.clientProfileRepository.getClientProfileByUserId(user_id)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    if (clientProfile.user.status < ClientUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }

    const photoFilepath = await UploadService.uploadFileTo(
      photo_file,
      this.clientProfilePath + user_id.toString() + '/',
      'profile-photo-' + getDatetimeForFileName()
    )

    const updatedPhoto: ClientProfilePhotoUpdateDTO = {
      photo_file: photoFilepath,
    }

    return await this.clientProfileRepository.updateClientProfilePhoto(user_id, updatedPhoto)
  }

  public async updateClientProfileDescription(user_id: number, description: string) {
    const clientProfile = await this.clientProfileRepository.getClientProfileByUserId(user_id)
    if (!clientProfile) {
      throw new Exception('Client profile not found', 404, 'E_NOT_FOUND')
    }
    if (clientProfile.user.status < ClientUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }
    const updatedDescription: ClientProfileDescriptionUpdateDTO = {
      description: description,
    }

    return await this.clientProfileRepository.updateClientProfileDescription(
      user_id,
      updatedDescription
    )
  }

  public async acceptClientCharter(user_id: number) {
    const user = await this.userRepository.getUserById(user_id)
    if (!user) {
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }
    if (user.status < ClientUserStatus.ACCOUNT_CREATED) {
      throw new Exception('User not available', 403, 'E_FORBIDDEN')
    }
    const updatedCharterAcceptation = {
      has_accepted_steewo_charter: true,
    }
    return await this.userRepository.updateUserData(user, updatedCharterAcceptation)
  }
}
