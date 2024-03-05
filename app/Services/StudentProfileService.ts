import { StudentProfileRepository } from './../DataAccessLayer/Repositories/StudentProfileRepository'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'
import { inject } from '@adonisjs/core/build/standalone'
import StudentProfileServiceInterface from '@Services/Interfaces/StudentProfileServiceInterface'
import Mail from '@ioc:Adonis/Addons/Mail'

@inject()
export class StudentProfileService implements StudentProfileServiceInterface {
  private studentProfileRepository: StudentProfileRepository
  private userRepository: UserRepository

  constructor(studentProfileRepository: StudentProfileRepository) {
    this.studentProfileRepository = studentProfileRepository
    this.userRepository = new UserRepository()
  }

  public async createStudentProfile(data: StudentProfileCreateDTO) {
    const fieldsOfUserToUpdate = {
      privacy_acceptation: data.privacy_acceptation,
      cgv_acceptation: data.cgv_acceptation,
    }
    const user = await this.userRepository.getUserById(data.user_id)
    if (!user) {
      throw new Error('User not found')
    }
    const sendEmail = Config.get('app.send_email', true)
    if (sendEmail) {
      await Mail.send((message) => {
        message
          .from('no-reply@steewo.io')
          .to(user.email)
          .subject('Steewo - Merci de vérifier votre email')
          .htmlView('emails/student_email_validation', {
            token: user.email_validation_token,
            email: user.email,
          })
      })
    }
    await this.userRepository.updateUserData(user, fieldsOfUserToUpdate)
    return await this.studentProfileRepository.createStudentProfile(data)
  }
}
