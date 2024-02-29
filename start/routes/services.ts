/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Role from '@Enums/Roles'

Route.group(() => {
  // SERVICES
  Route.get('/professions/:id_profession/services', 'ServicesController.getAllServicesByProfession')
    .as('getAllServicesByProfession')
    .middleware(['auth', 'isValidEmail'])
  Route.get('/professions/:id_profession/services/:id', 'ServicesController.getServiceById')
    .as('getServiceById')
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
