import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentProfile from '@Models/StudentProfile'

export default class IsStudentProfileOwner {
  public async handle({ auth, params, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user
    if (params.user_id) {
      if (user?.id !== Number(params.user_id)) {
        return response.unauthorized({ message: 'You can only access your own profile.' })
      }
    }
    if (params.student_profile_id) {
      const studentProfile = await StudentProfile.findBy('id', params.student_profile_id)
      if (user?.id !== studentProfile?.user_id) {
        return response.unauthorized({ message: 'You can only access your own profile.' })
      }
    }
    await next()
  }
}
