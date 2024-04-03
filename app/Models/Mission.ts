// ADONIS
import { BaseModel, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
// ENUMS
import MissionStatus from '@Enums/MissionStatus'
// MODELS
import MissionFile from '@Models/MissionFile'
import Service from '@Models/Service'

export default class Mission extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientProfilesId: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public messageForStudent: string | null

  @column()
  public status: MissionStatus

  @column()
  public engagementAcceptation: number | null

  @column.date()
  public plannedDueDate: DateTime | null

  @column()
  public plannedRoundTripsNumber: number | null

  @column()
  public price: number | null

  @column()
  public steewoCommission: number | null

  @column()
  public paymentStatus: number | null

  @column()
  public studentInvoicePath: string | null

  @column()
  public clientInvoicePath: string | null

  @column()
  public numberOfViews: number | null

  @column()
  public hasBeenCreatedByStudent: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @hasMany(() => MissionFile, {
    foreignKey: 'missions_id',
  })
  public files: HasMany<typeof MissionFile>

  @manyToMany(() => Service, {
    pivotTable: 'missions_has_services',
    localKey: 'id',
    pivotForeignKey: 'mission_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'service_id',
  })
  public services: ManyToMany<typeof Service>
}
