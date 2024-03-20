export default interface AchievementUpdateDTO {
  service_id: number
  title: string
  description?: string | null
  context?: string | null
  date?: Date | null
  isFavorite?: boolean
  main_image_file?: string | null
}
