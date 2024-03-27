export default interface AchievementDetailCreateOrUpdateDTO {
  achievementId: number
  type: string | null
  value?: string | null
  file?: string | null
  name?: string | null
  caption?: string | null
}
