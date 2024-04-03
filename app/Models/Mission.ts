// ADONIS
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
// MODELS
import MissionFile from '@Models/MissionFile'

export default class Mission extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientProfilesId: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public messageForStudent: string

  @column()
  public status: string

  @column()
  public engagementAcceptation: number

  @column.date()
  public plannedDueDate: DateTime

  @column()
  public plannedRoundTripsNumber: number

  @column()
  public price: number

  @column()
  public steewoCommission: number

  @column()
  public paymentStatus: number

  @column()
  public studentInvoicePath: string

  @column()
  public clientInvoicePath: string

  @column()
  public numberOfViews: number

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
}
