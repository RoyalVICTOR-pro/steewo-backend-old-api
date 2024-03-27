// ADONIS
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  beforeDelete,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
// MODELS
import Profession from '@Models/Profession'
import ServicesFormField from '@Models/ServicesFormField'
import StudentProfilesHasServices from '@Models/StudentProfilesHasServices'

export default class Service extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public profession_id: number

  @column()
  public name: string | null

  @column()
  public short_name: string | null

  @column()
  public picto_file: string | null

  @column()
  public image_file: string | null

  @column()
  public is_enabled: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @belongsTo(() => Profession)
  public profession: BelongsTo<typeof Profession>

  @hasMany(() => StudentProfilesHasServices)
  public studentProfilesHasServices: HasMany<typeof StudentProfilesHasServices>

  @beforeDelete()
  public static async deleteFormFields(service: Service) {
    const formFieldsOfThisService: ServicesFormField[] = await ServicesFormField.query().where(
      'service_id',
      service.id
    )
    for (let formField of formFieldsOfThisService) {
      await formField.delete()
    }
  }
}
