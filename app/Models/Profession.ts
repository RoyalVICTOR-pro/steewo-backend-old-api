import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Profession extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name_fr: string

  @column()
  public picto_path: string | null

  @column()
  public image_path: string | null

  @column()
  public is_enabled: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
