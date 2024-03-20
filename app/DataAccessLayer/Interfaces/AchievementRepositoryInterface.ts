export default interface AchievementRepositoryInterface {
  addAchievementToStudentProfile(
    studentProfileId: number,
    data: AchievementCreateDTO
  ): Promise<Achievement>
}
