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

Route.group(() => {
  // CLIENTS
  Route.post('/register-individual-client', 'ClientsController.createIndividualClientProfile').as(
    'createIndividualClientProfile'
  )
  Route.post(
    '/register-professional-client',
    'ClientsController.createProfessionnalClientProfile'
  ).as('createProfessionnalClientProfile')
  Route.get('/get-client-public-profile/:user_id', 'ClientsController.getClientPublicProfile')
    .as('getClientPublicProfile')
    .middleware('auth')
  Route.get('/get-client-private-profile/:user_id', 'ClientsController.getClientPrivateProfile')
    .as('getClientPrivateProfile')
    .middleware(['auth', 'isClientProfileOwner'])
}).prefix('/v1')
