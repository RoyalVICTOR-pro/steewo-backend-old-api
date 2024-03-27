// MODELS
import FailedLoginAttempt from '@Models/FailedLoginAttempt'

export default interface FailedLoginAttemptRepositoryInterface {
  addFailedAttempt(email: string): Promise<FailedLoginAttempt>
  hasTooManyAttempts(email: string): Promise<Boolean>
}
