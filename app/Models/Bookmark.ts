import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import ClientProfile from '@Models/ClientProfile'
import StudentProfile from '@Models/StudentProfile'

export default class Bookmark extends BaseModel {
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
