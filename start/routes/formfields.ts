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
  // FORM FIELDS
  Route.get('/services/:id_service/form-fields', 'FormFieldsController.getAllFormFieldsByService')
    .as('getAllFormFieldsByService')
    .middleware(['auth', 'isValidEmail'])
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
  Route.patch(
    '/form-fields/:id/delete-tooltip-image',
    'FormFieldsController.deleteFormFieldTooltipImage'
  )
    .as('deleteFormFieldTooltipImage')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.delete('/services/:id_service/form-fields/:id', 'FormFieldsController.deleteFormField')
    .as('deleteFormField')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
}).prefix('/v1')
