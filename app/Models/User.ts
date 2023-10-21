import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Country from 'App/Models/Country'
import Role from 'App/Enums/Roles'
import StudentUserStatus from 'App/Enums/StudentUserStatus'
import ClientUserStatus from 'App/Enums/ClientUserStatus'
import AuthentificationMode from 'App/Enums/AuthentificationMode'

export default class User extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public country_id: number

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public role: Role

  @column()
  public status: StudentUserStatus | ClientUserStatus

  @column()
  public user_language: string

  @column.dateTime()
  public privacy_acceptation: DateTime | null

  @column.dateTime()
  public cgv_acceptation: DateTime | null

  @column()
  public email_validation_token: string | null

  @column()
  public is_valid_email: boolean

  @column()
  public internal_or_sso: AuthentificationMode

  @column()
  public sso_provider_id: string | null

  @column()
  public rememberMeToken: string | null

  @column()
  public password_forgotten: string | null

  @column.dateTime()
  public password_forgotten_datetime: DateTime | null

  @column()
  public has_enabled_notifications: boolean

  @column()
  public has_accepted_steewo_charter: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
