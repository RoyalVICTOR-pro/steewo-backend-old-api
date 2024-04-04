import Route from '@ioc:Adonis/Core/Route'
import Role from '@Enums/Roles'

Route.group(() => {
  Route.group(() => {
    Route.post('/mission/create/:client_profile_id', 'MissionsController.createMission').as(
      'createMission'
    )
    Route.post(
      '/mission/:mission_id/add-service/:client_profile_id',
      'MissionsController.addServiceToMission'
    ).as('addServiceToMission')
  }).middleware([
    'auth',
    'isValidEmail',
    'isClientProfileOwner',
    `role:${[Role.CLIENT_INDIVIDUAL, Role.CLIENT_PROFESSIONAL]}`,
  ])
}).prefix('/v1')
