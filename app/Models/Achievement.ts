import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm'
import Service from '@Models/Service'
import StudentProfile from '@Models/StudentProfile'
import AchievementDetail from '@Models/AchievementDetail'
import UploadService from 'App/Services/UploadService'

export default class Achievement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public student_profile_id: number

  @column()
  public service_id: number

  @column.date()
  public date: DateTime | null

  @column()
  public title: string

  @column()
  public context: string | null

  @column()
  public description: string | null

  @column()
  public main_image_file: string | null

  @column()
  public is_favorite: boolean

  @column()
  public achievement_order: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Service, {
    foreignKey: 'service_id',
  })
  public service: BelongsTo<typeof Service>

  @belongsTo(() => StudentProfile, {
    foreignKey: 'student_profile_id',
  })
  public studentProfile: BelongsTo<typeof StudentProfile>

  @hasMany(() => AchievementDetail)
  public achievementDetails: HasMany<typeof AchievementDetail>

  @beforeDelete()
  public static async deleteDetails(achievement: Achievement) {
    if (achievement.main_image_file) await UploadService.deleteFile(achievement.main_image_file)
    const details: AchievementDetail[] = await AchievementDetail.query().where(
      'achievement_id',
      achievement.id
    )
    for (let detail of details) {
      if (detail.file) await UploadService.deleteFile(detail.file)
      await detail.delete()
    }
  }
}
