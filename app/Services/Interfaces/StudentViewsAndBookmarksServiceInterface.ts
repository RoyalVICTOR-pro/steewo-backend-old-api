export default interface StudentViewsAndBookmarksServiceInterface {
  getStudentViewsCount(userId: number): Promise<number>
  getStudentBookmarksCount(userId: number): Promise<number>
  addViewToStudentProfile(studentProfileId: number, clientProfileId: number): Promise<boolean>
  toggleStudentProfileBookmark(studentProfileId: number, clientProfileId: number): Promise<boolean>
  isStudentProfileBookmarked(studentProfileId: number, clientProfileId: number): Promise<boolean>
}
