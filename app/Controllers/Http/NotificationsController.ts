// ADONIS
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject, Exception } from '@adonisjs/core/build/standalone'
// SERVICES
import NotificationService from '@Services/NotificationService'

@inject()
export default class NotificationsController {
  private notificationService: NotificationService
  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService
  }

  public async getNotificationsOfUser({ auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      throw new Exception('User not found', 404)
    }

    const notifications = await this.notificationService.getNotificationsOfUser(user.id)

    return response.status(200).json(notifications)
  }

  public async toggleNotificationReadStatus({ auth, params, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      throw new Exception('User not found', 404)
    }

    const notificationId = params.notification_id
    const notification = await this.notificationService.toggleNotificationReadStatus(
      notificationId,
      user.id
    )

    return response.status(200).json(notification)
  }

  public async deleteNotification({ params, response }: HttpContextContract) {
    const notificationId = params.notification_id
    await this.notificationService.deleteNotification(notificationId)

    return response.status(204).json({ message: 'Notification deleted' })
  }
}
