// ADONIS
import { DateTime } from 'luxon'

export default interface AchievementUpdateDTO {
  service_id: number
  title: string
  description?: string | null
  context?: string | null
  date?: DateTime | null
  is_favorite?: boolean
  main_image_file?: string | null
}
