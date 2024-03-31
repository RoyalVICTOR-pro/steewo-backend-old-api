// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import { Exception } from '@adonisjs/core/build/standalone'
// REPOSITORIES
import NotificationRepository from '@DALRepositories/NotificationRepository'
// DTO
import NotificationCreateDTO from '@DTO/NotificationCreateDTO'

@inject()
export default class NotificationService {
  private notificationRepository: NotificationRepository

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository
  }

  public static async createNotification(data: NotificationCreateDTO) {
    const notification = await NotificationRepository.createNotification(data)
    return notification
  }

  public async getNotificationsOfUser(userId: number) {
    return await this.notificationRepository.getNotificationsOfUser(userId)
  }

  public async toggleNotificationReadStatus(notificationId: number, userId: number) {
    const notification = await this.notificationRepository.getNotificationById(notificationId)

    if (!notification) {
      throw new Exception('Notification not found', 404)
    }

    if (notification.user_id !== userId) {
      throw new Exception('User not allowed to update this notification', 403)
    }

    const updatedNotification = await this.notificationRepository.updateNotificationById(
      notificationId,
      {
        user_id: notification.user_id,
        has_been_read: !notification.has_been_read,
      }
    )

    return updatedNotification
  }

  public async deleteNotification(notificationId: number) {
    await this.notificationRepository.deleteNotification(notificationId)
  }
}
