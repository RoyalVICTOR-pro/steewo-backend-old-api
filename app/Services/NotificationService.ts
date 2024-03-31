// ADONIS
import { inject } from '@adonisjs/core/build/standalone'
import { Exception } from '@adonisjs/core/build/standalone'
// REPOSITORIES
import NotificationRepository from '@DALRepositories/NotificationRepository'
// DTO
import NotificationCreateDTO from '@DTO/NotificationCreateDTO'

@inject()
export default class NotificationService {
  private static notificationRepository: NotificationRepository

  constructor(notificationRepository: NotificationRepository) {
    NotificationService.notificationRepository = notificationRepository
  }

  public static async createNotification(data: NotificationCreateDTO) {
    const notification = await NotificationService.notificationRepository.createNotification(data)
    return notification
  }

  public async getNotificationsOfUser(userId: number) {
    return await NotificationService.notificationRepository.getNotificationsOfUser(userId)
  }

  public async toggleNotificationReadStatus(notificationId: number, userId: number) {
    const notification =
      await NotificationService.notificationRepository.getNotificationById(notificationId)

    if (!notification) {
      throw new Exception('Notification not found', 404)
    }

    if (notification.user_id !== userId) {
      throw new Exception('User not allowed to update this notification', 403)
    }

    const updatedNotification =
      await NotificationService.notificationRepository.updateNotificationById(notificationId, {
        user_id: notification.user_id,
        has_been_read: !notification.has_been_read,
      })

    return updatedNotification
  }

  public async deleteNotification(notificationId: number) {
    await NotificationService.notificationRepository.deleteNotification(notificationId)
  }
}
