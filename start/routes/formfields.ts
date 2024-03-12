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
