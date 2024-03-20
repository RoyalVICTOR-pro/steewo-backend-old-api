export default interface AchievementDetailCreateOrUpdateDTO {
  achievement_id: number
  type?: string | null
  value?: string | null
  file?: string | null
  name?: string | null
  caption?: string | null
}
