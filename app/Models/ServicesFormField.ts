import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Service from 'App/Models/Service'

export default class ServicesFormField extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public serviceId: number

  @column()
  public order: number

  @column()
  public type: string

  @column()
  public label_fr: string

  @column()
  public mandatory: boolean

  @column()
  public tooltipImageFile: string

  @column()
  public tooltipText_fr: string

  @column()
  public description_fr: string

  @column()
  public placeholder_fr: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>
}
