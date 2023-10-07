import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Country from 'App/Models/Country'
import Role from 'App/Enum/Roles'
import StudentUserStatus from 'App/Enum/StudentUserStatus'
import ClientUserStatus from 'App/Enum/ClientUserStatus'
import AuthentificationMode from 'App/Enum/AuthentificationMode'

export default class User extends BaseModel {
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
  public emailValidationToken: string | null

  @column()
  public isValidEmail: boolean

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
  public has_Enabled_Notifications: boolean

  @column()
  public has_Accepted_Steewo_Charter: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
