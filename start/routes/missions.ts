import Route from '@ioc:Adonis/Core/Route'
import Role from '@Enums/Roles'

Route.group(() => {
  Route.post('/mission/create/:client_profile_id', 'MissionsController.createMission')
    .as('createMission')
    .middleware([
      'auth',
      'isValidEmail',
      'isClientProfileOwner',
      `role:${[Role.CLIENT_INDIVIDUAL, Role.CLIENT_PROFESSIONAL]}`,
    ])
}).prefix('/v1')
