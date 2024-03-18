import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Service from '@Models/Service'
import StudentProfile from '@Models/StudentProfile'

export default class StudentProfilesAndServicesRelation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public student_profile_id: number

  @column()
  public service_id: number

  @column()
  public service_has_been_accepted: boolean

  // Define relationships (optional)
  @belongsTo(() => StudentProfile, {
    foreignKey: 'student_profile_id',
  })
  public studentProfile: BelongsTo<typeof StudentProfile>

  @belongsTo(() => Service, {
    foreignKey: 'service_id',
  })
  public service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
