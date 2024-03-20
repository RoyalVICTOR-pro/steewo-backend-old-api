import { DateTime } from 'luxon'

export default interface AchievementCreateDTO {
  service_id: number
  title: string
  description?: string | null
  context?: string | null
  date?: DateTime | null
  isFavorite?: boolean
  main_image_file?: string
  achievement_details?: string[] | null
}
