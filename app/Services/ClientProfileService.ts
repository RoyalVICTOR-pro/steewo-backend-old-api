import { ClientProfileRepository } from './../DataAccessLayer/Repositories/ClientProfileRepository'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
import { ClientProfileCreateDTO } from '@DTO/ClientProfileCreateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import ClientProfileServiceInterface from '@Services/Interfaces/ClientProfileServiceInterface'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

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
      throw new Error('User not found')
    }

    const sendEmail = Env.get('SEND_EMAIL')
    if (sendEmail === 'true') {
      await Mail.send((message) => {
        message
          .from('no-reply@steewo.io')
          .to(user.email)
          .subject('Steewo - Merci de vérifier votre email')
          .htmlView('emails/client_email_validation', {
            token: user.email_validation_token,
            email: user.email,
          })
      })
    }
    await this.userRepository.updateUserData(user, fieldsOfUserToUpdate)
    return await this.clientProfileRepository.createClientProfile(data)
  }
}
