import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Service from '@Models/Service'

export default class ServicesFormField extends compose(BaseModel, SoftDeletes) {
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
  public tooltipText_fr: string | null

  @column()
  public description_fr: string | null

  @column()
  public placeholder_fr: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>
}
