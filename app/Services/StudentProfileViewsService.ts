import StudentProfileView from '@Models/StudentProfileView'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StudentProfileViewsService {
  public static async addView(studentProfileId: number, clientProfileId: number) {
    const alreadyViewed = await StudentProfileView.query()
      .where('student_profile_id', studentProfileId)
      .where('client_profile_id', clientProfileId)
      .first()
    if (alreadyViewed) {
      return false
    }

    const view = new StudentProfileView()
    view.student_profile_id = studentProfileId
    view.client_profile_id = clientProfileId
    await view.save()
    return true
  }

  public static async countViews(studentProfileId: number) {
    const viewsCount = await Database.from('student_profile_views')
      .where('student_profile_id', studentProfileId)
      .count('* as total')
    return viewsCount[0].total
  }
}
