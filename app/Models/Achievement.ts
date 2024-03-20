import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Service from '@Models/Service'
import StudentProfile from '@Models/StudentProfile'
import AchievementDetail from '@Models/AchievementDetail'

export default class Achievement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public studentProfileId: number

  @column()
  public serviceId: number

  @column()
  public date: Date | null

  @column()
  public name: string | null

  @column()
  public context: string | null

  @column()
  public description: string | null

  @column()
  public mainImagePath: string | null

  @column()
  public isFavorite: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Service, {
    foreignKey: 'serviceId',
  })
  public service: BelongsTo<typeof Service>

  @belongsTo(() => StudentProfile, {
    foreignKey: 'studentProfileId',
  })
  public studentProfile: BelongsTo<typeof StudentProfile>

  @hasMany(() => AchievementDetail)
  public achievementDetails: HasMany<typeof AchievementDetail>
}
