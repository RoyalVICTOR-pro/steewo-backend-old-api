import { FailedLoginAttemptDTO } from '@DTO/FailedLoginAttemptDTO'
import FailedLoginAttempt from '@Models/FailedLoginAttempt'

export default interface FailedLoginAttemptInterface {
  addFailedAttempt(email: string): Promise<FailedLoginAttempt>
  hasTooManyAttempts(email: string): Promise<Boolean>
}
