import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class StudentProfile extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public firstname: string | null

  @column()
  public lastname: string | null

  @column.date()
  public date_of_birth: DateTime | null

  @column()
  public place_of_birth: string | null

  @column()
  public mobile: string | null

  @column()
  public last_diploma: string | null

  @column()
  public last_diploma_school: string | null

  @column.dateTime()
  public last_diploma_start_date: DateTime | null

  @column.dateTime()
  public last_diploma_end_date: DateTime | null

  @column()
  public current_diploma: string | null

  @column()
  public current_school: string | null

  @column.dateTime()
  public current_diploma_start_date: DateTime | null

  @column.dateTime()
  public current_diploma_end_date: DateTime | null

  @column()
  public siret_number: string | null

  @column()
  public bank_iban: string | null

  @column()
  public description: string | null

  @column()
  public average_rating: number | null

  @column()
  public job_title: string | null

  @column()
  public address_number: string | null

  @column()
  public address_road: string | null

  @column()
  public address_postal_code: string | null

  @column()
  public address_city: string | null

  @column()
  public gender: number | null

  @column()
  public study_level: string | null

  @column()
  public photo_file: string | null

  @column()
  public banner_file: string | null

  @column()
  public school_certificate_file: string | null

  @column()
  public company_exists_proof_file: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
