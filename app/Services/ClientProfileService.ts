import { ClientProfileRepository } from './../DataAccessLayer/Repositories/ClientProfileRepository'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
import { ClientProfileCreateDTO } from '@DTO/ClientProfileCreateDTO'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import ClientProfileServiceInterface from '@Services/Interfaces/ClientProfileServiceInterface'
import MailService from '@Services/MailService'

@inject()
export class ClientProfileService implements ClientProfileServiceInterface {
  private clientProfileRepository: ClientProfileRepository
  private userRepository: UserRepository

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
}
