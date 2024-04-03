import Route from '@ioc:Adonis/Core/Route'
import Role from '@Enums/Roles'

Route.group(() => {
  // SERVICES
  Route.get('/professions/:id_profession/services', 'ServicesController.getAllServicesByProfession')
    .as('getAllServicesByProfession')
    .middleware(['auth', 'isValidEmail', `role:${[Role.ADMIN]}`])
  Route.get(
    '/public-professions/:id_profession/public-services',
    'ServicesController.getAllPublicServicesByProfession'
  )
    .as('getAllPublicServicesByProfession')
    .middleware(['auth', 'isValidEmail'])
  Route.get('/professions/:id_profession/services/:id', 'ServicesController.getServiceById')
    .as('getServiceById')
    .middleware(['auth', 'isValidEmail', `role:${[Role.ADMIN]}`])
  Route.get(
    '/public-professions/:id_profession/public-services/:id',
    'ServicesController.getPublicServiceById'
  )
    .as('getPublicServiceById')
    .middleware(['auth', 'isValidEmail'])
  Route.post('/professions/:id_profession/services', 'ServicesController.createService')
    .as('createService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.put('/professions/:id_profession/services/:id', 'ServicesController.updateService')
    .as('updateService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch('/professions/:id_profession/services/:id', 'ServicesController.updateServiceStatus')
    .as('updateServiceStatus')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch('/services/:id/delete-picto', 'ServicesController.deleteServicePicto')
    .as('deleteServicePicto')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch('/services/:id/delete-image', 'ServicesController.deleteServiceImage')
    .as('deleteServiceImage')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.delete('/professions/:id_profession/services/:id', 'ServicesController.deleteService')
    .as('deleteService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
    .middleware(['auth', `role:${[Role.ADMIN]}`])
}).prefix('/v1')
