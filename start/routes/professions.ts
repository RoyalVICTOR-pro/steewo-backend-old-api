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
  // PROFESSIONS
  Route.get('/professions', 'ProfessionsController.getAllProfessions')
    .as('getAllProfessions')
    .middleware(['auth', 'isValidEmail'])
  Route.get('/professions/:id', 'ProfessionsController.getProfessionById')
    .as('getProfessionById')
    .middleware(['auth', 'isValidEmail'])
  Route.post('/professions', 'ProfessionsController.createProfession')
    .as('createProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.put('/professions/:id', 'ProfessionsController.updateProfession')
    .as('updateProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch('/professions/:id', 'ProfessionsController.updateProfessionStatus')
    .as('updateProfessionStatus')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch('/professions/:id/delete-picto', 'ProfessionsController.deleteProfessionPicto')
    .as('deleteProfessionPicto')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.patch('/professions/:id/delete-image', 'ProfessionsController.deleteProfessionImage')
    .as('deleteProfessionImage')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
  Route.delete('/professions/:id', 'ProfessionsController.deleteProfession')
    .as('deleteProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
}).prefix('/v1')
