import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Profession from '@Models/Profession'
import StudentProfile from '@Models/StudentProfile'

export default class StudentProfilesAndProfessionsRelation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public student_profile_id: number

  @column()
  public profession_id: number

  @column()
  public has_been_accepted: boolean

  // Define relationships (optional)
  @belongsTo(() => StudentProfile, {
    foreignKey: 'student_profile_id',
  })
  public studentProfile: BelongsTo<typeof StudentProfile>

  @belongsTo(() => Profession, {
    foreignKey: 'profession_id',
  })
  public profession: BelongsTo<typeof Profession>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
