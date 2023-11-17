import { inject } from '@adonisjs/core/build/standalone'
import FailedLoginAttemptRepositoryInterface from '@DALInterfaces/FailedLoginAttemptRepositoryInterface'
import FailedLoginAttempt from '@Models/FailedLoginAttempt'

@inject()
export class FailedLoginAttemptRepository implements FailedLoginAttemptRepositoryInterface {
  public async addFailedAttempt(email: string): Promise<FailedLoginAttempt> {
    const failedLoginAttempt = new FailedLoginAttempt()
    failedLoginAttempt.email = email
    await failedLoginAttempt.save()
    return failedLoginAttempt
  }

  public async hasTooManyAttempts(email: string): Promise<Boolean> {
    const threeMinutesAgo = new Date()
    threeMinutesAgo.setMinutes(threeMinutesAgo.getMinutes() - 3)

    const query = FailedLoginAttempt.query()
      .where('email', email)
      .where('createdAt', '>', threeMinutesAgo)

    const count = await query.count('* as total')

    if (count[0].$extras.total >= 3) {
      return true
    }
    return false
  }
}
