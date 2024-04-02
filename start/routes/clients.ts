import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // CLIENTS
  Route.post(
    '/client/register-individual',
    'ClientsProfileController.createIndividualClientProfile'
  ).as('createIndividualClientProfile')
  Route.post(
    '/client/register-professional',
    'ClientsProfileController.createProfessionnalClientProfile'
  ).as('createProfessionnalClientProfile')
  Route.get(
    '/client/get-public-profile/:user_id',
    'ClientsProfileController.getClientPublicProfile'
  )
    .as('getClientPublicProfile')
    .middleware(['auth', 'isValidEmail'])
  Route.get(
    '/client/get-private-profile/:user_id',
    'ClientsProfileController.getClientPrivateProfile'
  )
    .as('getClientPrivateProfile')
    .middleware(['auth', 'isClientProfileOwner', 'isValidEmail'])
  Route.patch(
    '/client/update-profile/:user_id/main',
    'ClientsProfileController.updateClientProfileMainInfo'
  )
    .as('updateClientProfileMainInfo')
    .middleware(['auth', 'isClientProfileOwner', 'isValidEmail'])
  Route.patch(
    '/client/update-profile/:user_id/photo',
    'ClientsProfileController.updateClientProfilePhoto'
  )
    .as('updateClientProfilePhoto')
    .middleware(['auth', 'isClientProfileOwner', 'isValidEmail'])

  Route.patch(
    '/client/update-profile/:user_id/description',
    'ClientsProfileController.updateClientProfileDescription'
  )
    .as('updateClientProfileDescription')
    .middleware(['auth', 'isClientProfileOwner', 'isValidEmail'])
  Route.patch('/client/accept-charter/:user_id', 'ClientsProfileController.acceptClientCharter')
    .as('acceptClientCharter')
    .middleware(['auth', 'isClientProfileOwner', 'isValidEmail'])
}).prefix('/v1')
