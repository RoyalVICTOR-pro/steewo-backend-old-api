import { StudentProfileRepository } from './../DataAccessLayer/Repositories/StudentProfileRepository'
import { UserRepository } from 'App/DataAccessLayer/Repositories/UserRepository'
import { StudentProfileCreateDTO } from '@DTO/StudentProfileCreateDTO'
import { inject, Exception } from '@adonisjs/core/build/standalone'
import StudentProfileServiceInterface from '@Services/Interfaces/StudentProfileServiceInterface'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

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
      throw new Exception('User not found', 404, 'E_NOT_FOUND')
    }

    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(
      data.user_id
    )
    if (studentProfile) {
      throw new Exception('Student profile already exists', 409, 'E_CONFLICT')
    }

    const sendEmail = Env.get('SEND_EMAIL')
    if (sendEmail === 'true') {
      await Mail.send((message) => {
        message
          .from('no-reply@steewo.io')
          .to(user.email)
          .subject('Steewo - Merci de vérifier votre email')
          .htmlView('emails/student_email_validation', {
            token: user.email_validation_token,
            email: user.email,
            firstname: data.firstname,
          })
      })
    }
    await this.userRepository.updateUserData(user, fieldsOfUserToUpdate)
    return await this.studentProfileRepository.createStudentProfile(data)
  }
}
