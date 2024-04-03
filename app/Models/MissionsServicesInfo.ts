import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MissionsServicesInfo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public missionHasServiceId: number

  @column()
  public serviceFormFieldId: number

  @column()
  public label: string

  @column()
  public fileCaption: string

  @column()
  public value: string

  @column()
  public order: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
