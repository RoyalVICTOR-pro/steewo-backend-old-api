// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
// DTO
import NotificationCreateDTO from '@DTO/NotificationCreateDTO'
import NotificationUpdateDTO from '../DTO/NotificationUpdateDTO'
// MODELS
import Notification from '@Models/Notification'

@inject()
export default class NotificationRepository {
  public async createNotification(data: NotificationCreateDTO): Promise<Notification> {
    const notification = new Notification()
    notification.user_id = data.user_id
    notification.title = data.title
    notification.content = data.content
    if (data.link_to_go) notification.link_to_go = data.link_to_go
    notification.has_been_read = false

    await notification.save()
    return notification
  }

  public async getNotificationsOfUser(userId: number): Promise<Notification[]> {
    const notifications = await Notification.query().where('user_id', userId)
    return notifications
  }

  public async getNotificationById(id: number): Promise<Notification | null> {
    const notification = await Notification.find(id)
    return notification
  }

  public async updateNotificationById(
    idToUpdate: number,
    data: NotificationUpdateDTO
  ): Promise<Notification> {
    const notification = await Notification.findOrFail(idToUpdate)
    notification.merge(data)
    await notification.save()
    return notification
  }

  public async deleteNotification(id: number): Promise<boolean> {
    const notification = await Notification.findOrFail(id)
    await notification.delete()
    return true
  }
}
