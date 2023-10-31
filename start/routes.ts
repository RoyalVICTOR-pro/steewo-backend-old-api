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
import Role from 'App/Enums/Roles'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/register', 'AuthController.register').as('register')
  Route.post('/login', 'AuthController.login').as('login')

  // PROFESSIONS
  Route.get('/professions', 'ProfessionsController.getAllProfessions')
    .as('getAllProfessions')
    .middleware('auth')
  Route.get('/professions/:id', 'ProfessionsController.getProfessionById')
    .as('getProfessionById')
    .middleware('auth')
  Route.post('/professions', 'ProfessionsController.createProfession')
    .as('createProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.put('/professions/:id', 'ProfessionsController.updateProfession')
    .as('updateProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.delete('/professions/:id', 'ProfessionsController.deleteProfession')
    .as('deleteProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  // SERVICES
  Route.get('/professions/:id_profession/services', 'ServicesController.getAllServicesByProfession')
    .as('getAllServicesByProfession')
    .middleware('auth')
  Route.get('/professions/:id_profession/services/:id', 'ServicesController.getServiceById')
    .as('getServiceById')
    .middleware('auth')
  Route.post('/professions/:id_profession/services', 'ServicesController.createService')
    .as('createService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.put('/professions/:id_profession/services/:id', 'ServicesController.updateService')
    .as('updateService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.delete('/professions/:id_profession/services/:id', 'ServicesController.deleteService')
    .as('deleteService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  // FORM FIELDS
  Route.get('/services/:id_service/form-fields', 'FormFieldsController.getAllFormFieldsByService')
    .as('getAllFormFieldsByService')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.get('/services/:id_service/form-fields/:id', 'FormFieldsController.getFormFieldById')
    .as('getFormFieldById')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.post('/services/:id_service/form-fields', 'FormFieldsController.createFormField')
    .as('createFormField')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.put('/services/:id_service/form-fields/:id', 'FormFieldsController.updateFormField')
    .as('updateFormField')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch(
    '/services/:id_service/form-fields/order',
    'FormFieldsController.updateFormFieldOrder'
  )
    .as('updateFormFieldOrder')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.delete('/services/:id_service/form-fields/:id', 'FormFieldsController.deleteFormField')
    .as('deleteFormField')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
}).prefix('/v1')
