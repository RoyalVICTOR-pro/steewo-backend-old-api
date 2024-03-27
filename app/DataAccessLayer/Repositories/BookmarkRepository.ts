// ADONIS
import Database from '@ioc:Adonis/Lucid/Database'
// MODELS
import Bookmark from '@Models/Bookmark'

export default class StudentBookmarksRepository {
  public static async isBookmarked(studentProfileId: number, clientProfileId: number) {
    const alreadyBookmarked = await Bookmark.query()
      .where('student_profile_id', studentProfileId)
      .where('client_profile_id', clientProfileId)
      .first()
    return alreadyBookmarked ? true : false
  }

  public static async toggleBookmark(studentProfileId: number, clientProfileId: number) {
    if (await this.isBookmarked(studentProfileId, clientProfileId)) {
      await Bookmark.query()
        .where('student_profile_id', studentProfileId)
        .where('client_profile_id', clientProfileId)
        .delete()
      return false
    }

    const bookmark = new Bookmark()
    bookmark.student_profile_id = studentProfileId
    bookmark.client_profile_id = clientProfileId
    await bookmark.save()
    return true
  }

  public static async countBookmarks(studentProfileId: number) {
    const bookmarksCount = await Database.from('bookmarks')
      .where('student_profile_id', studentProfileId)
      .count('* as total')
    return bookmarksCount[0].total
  }
}
