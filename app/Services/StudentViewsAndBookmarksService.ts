// ADONIS
import { inject, Exception } from '@adonisjs/core/build/standalone'
// INTERFACES
import StudentViewsAndBookmarksServiceInterface from '@Services/Interfaces/StudentViewsAndBookmarksServiceInterface'
// REPOSITORIES
import StudentBookmarksRepository from '@DALRepositories/BookmarkRepository'
import StudentProfileRepository from '@DALRepositories/StudentProfileRepository'
import StudentProfileViewRepository from '@DALRepositories/StudentProfileViewRepository'

@inject()
export default class StudentViewsAndBookmarksService
  implements StudentViewsAndBookmarksServiceInterface
{
  private studentProfileRepository: StudentProfileRepository

  constructor(studentProfileRepository: StudentProfileRepository) {
    this.studentProfileRepository = studentProfileRepository
  }

  public async getStudentViewsCount(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('You are not a student', 401, 'E_UNAUTHORIZED')
    }
    const studentProfileViews = await StudentProfileViewRepository.countViews(studentProfile.id)
    return studentProfileViews
  }

  public async addViewToStudentProfile(studentProfileId: number, clientProfileId: number) {
    return await StudentProfileViewRepository.addView(
      Number(studentProfileId),
      Number(clientProfileId)
    )
  }

  public async getStudentBookmarksCount(user_id: number) {
    const studentProfile = await this.studentProfileRepository.getStudentProfileByUserId(user_id)
    if (!studentProfile) {
      throw new Exception('You are not a student', 401, 'E_UNAUTHORIZED')
    }
    return await StudentBookmarksRepository.countBookmarks(studentProfile.id)
  }

  public async toggleStudentProfileBookmark(studentProfileId: number, clientProfileId: number) {
    return await StudentBookmarksRepository.toggleBookmark(studentProfileId, clientProfileId)
  }

  public async isStudentProfileBookmarked(studentProfileId: number, clientProfileId: number) {
    return await StudentBookmarksRepository.isBookmarked(studentProfileId, clientProfileId)
  }
}
