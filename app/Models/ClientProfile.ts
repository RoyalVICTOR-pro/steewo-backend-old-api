import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class ClientProfile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public firstname: string | null

  @column()
  public lastname: string | null

  @column.dateTime()
  public date_of_birth: DateTime | null

  @column()
  public phone: string | null

  @column()
  public address_number: string | null

  @column()
  public address_road: string | null

  @column()
  public address_postal_code: string | null

  @column()
  public address_city: string | null

  @column()
  public company_name: string | null

  @column()
  public position: string | null

  @column()
  public siret_number: string | null

  @column()
  public bank_iban: string | null

  @column()
  public average_rating: number | null

  @column()
  public description: string | null

  @column()
  public photo_file: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>
}
