import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Achievement from '@Models/Achievement'

export default class AchievementDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public achievementId: number

  @column()
  public type: string | null

  @column()
  public value: string | null

  @column()
  public name: string | null

  @column()
  public caption: string | null

  @column()
  public detailOrder: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Achievement, {
    foreignKey: 'achievementId',
  })
  public achievement: BelongsTo<typeof Achievement>
}
