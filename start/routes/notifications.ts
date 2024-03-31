import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/get-notifications-of-user', 'NotificationsController.getNotificationsOfUser')
    .as('getNotificationsOfUser')
    .middleware('auth')
  Route.patch(
    '/toggle-notification-read-status/:notification_id',
    'NotificationsController.toggleNotificationReadStatus'
  )
    .as('toggleNotificationReadStatus')
    .middleware('auth')
  Route.delete(
    '/delete-notification/:notification_id',
    'NotificationsController.deleteNotification'
  )
    .as('deleteNotification')
    .middleware('auth')
}).prefix('/v1')
