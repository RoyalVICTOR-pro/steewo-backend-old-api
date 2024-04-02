// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// ENUMS
import Role from '@Enums/Roles'
// SERVICES
import AuthService from '@Services/AuthService'
import StudentViewsAndBookmarksService from '@Services/StudentViewsAndBookmarksService'

@inject()
export default class StudentsViewsAndBookmarksController {
  private studentViewsAndBookmarksService: StudentViewsAndBookmarksService
  constructor(studentViewsAndBookmarksService: StudentViewsAndBookmarksService) {
    this.studentViewsAndBookmarksService = studentViewsAndBookmarksService
  }

  public async getStudentViewsCount({ auth, response }: HttpContextContract) {
    const studentViewsCount = await this.studentViewsAndBookmarksService.getStudentViewsCount(
      auth.user!.id
    )
    return response.ok({ nb_views: studentViewsCount }) // 200 OK
  }

  public async getStudentBookmarksCount({ auth, response }: HttpContextContract) {
    const studentBookmarksCount =
      await this.studentViewsAndBookmarksService.getStudentBookmarksCount(auth.user!.id)
    return response.ok({ nb_bookmarks: studentBookmarksCount }) // 200 OK
  }

  public async addViewToStudentProfile({ auth, params, response }: HttpContextContract) {
    let userRole: number = await AuthService.getRoleByAuth(auth)
    if (userRole !== Role.CLIENT_INDIVIDUAL && userRole !== Role.CLIENT_PROFESSIONAL) {
      throw new Exception('You cannot add a view to a student profile', 400, 'E_BAD_REQUEST')
    }
    if (
      await this.studentViewsAndBookmarksService.addViewToStudentProfile(
        Number(params.student_profile_id),
        Number(params.client_profile_id)
      )
    ) {
      return response.status(200).send('View added') // 200 OK
    }
    return response.status(400).send('View already added') // 400 BAD REQUEST
  }

  public async toggleStudentProfileBookmark({ auth, params, response }: HttpContextContract) {
    let userRole: number = await AuthService.getRoleByAuth(auth)
    if (userRole !== Role.CLIENT_INDIVIDUAL && userRole !== Role.CLIENT_PROFESSIONAL) {
      throw new Exception('You cannot add a view to a student profile', 400, 'E_BAD_REQUEST')
    }

    await this.studentViewsAndBookmarksService.toggleStudentProfileBookmark(
      Number(params.student_profile_id),
      Number(params.client_profile_id)
    )

    return response.status(200).send('Bookmark toggled') // 200 OK
  }

  public async isStudentProfileBookmarked({ auth, params, response }: HttpContextContract) {
    let userRole: number = await AuthService.getRoleByAuth(auth)
    if (userRole !== Role.CLIENT_INDIVIDUAL && userRole !== Role.CLIENT_PROFESSIONAL) {
      throw new Exception('You cannot add a view to a student profile', 400, 'E_BAD_REQUEST')
    }

    const isBookmarked = await this.studentViewsAndBookmarksService.isStudentProfileBookmarked(
      Number(params.student_profile_id),
      Number(params.client_profile_id)
    )
    return response.ok({ answer: isBookmarked }) // 200 OK
  }
}
