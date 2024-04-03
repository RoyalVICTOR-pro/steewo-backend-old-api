// ADONIS
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
// MODELS
import MissionsServicesInfo from 'App/Models/MissionsServicesInfo'

export default class MissionsHasService extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public missionId: number

  @column()
  public serviceId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => MissionsServicesInfo, {
    foreignKey: 'missionHasServiceId',
  })
  public infos: HasMany<typeof MissionsServicesInfo>
}
