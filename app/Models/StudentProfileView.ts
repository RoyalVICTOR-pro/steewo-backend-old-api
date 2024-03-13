import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import StudentProfile from 'App/Models/StudentProfile'
import ClientProfile from 'App/Models/ClientProfile'

export default class StudentProfileView extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public student_profile_id: number

  @column()
  public client_profile_id: number

  // Define relationships (optional)
  @belongsTo(() => StudentProfile, {
    foreignKey: 'student_profile_id',
  })
  public studentProfile: BelongsTo<typeof StudentProfile>

  @belongsTo(() => ClientProfile, {
    foreignKey: 'client_profile_id',
  })
  public clientProfile: BelongsTo<typeof ClientProfile>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
