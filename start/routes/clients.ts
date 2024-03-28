import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // CLIENTS
  Route.post('/client/register-individual', 'ClientsController.createIndividualClientProfile').as(
    'createIndividualClientProfile'
  )
  Route.post(
    '/client/register-professional',
    'ClientsController.createProfessionnalClientProfile'
  ).as('createProfessionnalClientProfile')
  Route.get('/client/get-public-profile/:user_id', 'ClientsController.getClientPublicProfile')
    .as('getClientPublicProfile')
    .middleware('auth')
  Route.get('/client/get-private-profile/:user_id', 'ClientsController.getClientPrivateProfile')
    .as('getClientPrivateProfile')
    .middleware(['auth', 'isClientProfileOwner'])
  Route.patch(
    '/client/update-profile/:user_id/main',
    'ClientsController.updateClientProfileMainInfo'
  )
    .as('updateClientProfileMainInfo')
    .middleware(['auth', 'isClientProfileOwner'])
  Route.patch('/client/update-profile/:user_id/photo', 'ClientsController.updateClientProfilePhoto')
    .as('updateClientProfilePhoto')
    .middleware(['auth', 'isClientProfileOwner'])
  Route.patch(
    '/client/update-profile/:user_id/banner',
    'ClientsController.updateClientProfileBanner'
  )
    .as('updateClientProfileBanner')
    .middleware(['auth', 'isClientProfileOwner'])
  Route.patch(
    '/client/update-profile/:user_id/description',
    'ClientsController.updateClientProfileDescription'
  )
    .as('updateClientProfileDescription')
    .middleware(['auth', 'isClientProfileOwner'])
  Route.patch('/client/accept-charter/:user_id', 'ClientsController.acceptClientCharter')
    .as('acceptClientCharter')
    .middleware(['auth', 'isClientProfileOwner'])
}).prefix('/v1')
