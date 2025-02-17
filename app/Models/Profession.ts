import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeDelete } from '@ioc:Adonis/Lucid/Orm'
import Service from '@Models/Service'
import UploadService from '@Services/UploadService'

export default class Profession extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

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

  @beforeDelete()
  public static async deleteServices(profession: Profession) {
    const services: Service[] = await Service.query().where('profession_id', profession.id)
    for (let service of services) {
      if (service.picto_file) await UploadService.deleteFile(service.picto_file)
      if (service.image_file) await UploadService.deleteFile(service.image_file)
      await service.delete()
    }
  }
}
