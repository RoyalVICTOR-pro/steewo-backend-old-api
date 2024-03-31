export default interface NotificationCreateDTO {
  user_id: number
  title: string
  content: string
  link_to_go?: string
}
