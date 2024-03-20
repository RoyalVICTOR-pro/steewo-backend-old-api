import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Service from '@Models/Service'
import StudentProfile from '@Models/StudentProfile'
import AchievementDetail from '@Models/AchievementDetail'

export default class Achievement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public student_profile_id: number

  @column()
  public service_id: number

  @column.date()
  public date: DateTime | null

  @column()
  public title: string | null

  @column()
  public context: string | null

  @column()
  public description: string | null

  @column()
  public mainImageFile: string | null

  @column()
  public isFavorite: boolean

  @column()
  public achievementOrder: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Service, {
    foreignKey: 'service_id',
  })
  public service: BelongsTo<typeof Service>

  @belongsTo(() => StudentProfile, {
    foreignKey: 'student_profile_id',
  })
  public studentProfile: BelongsTo<typeof StudentProfile>

  @hasMany(() => AchievementDetail)
  public achievementDetails: HasMany<typeof AchievementDetail>
}
