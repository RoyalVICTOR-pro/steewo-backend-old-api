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
  // STUDENTS
  Route.post('/register-student', 'StudentsController.createStudentProfile').as(
    'createStudentProfile'
  )
  Route.get('/get-student-public-profile/:user_id', 'StudentsController.getStudentPublicProfile')
    .as('getStudentPublicProfile')
    .middleware('auth')
  Route.get('/get-student-private-profile/:user_id', 'StudentsController.getStudentPrivateProfile')
    .as('getStudentPrivateProfile')
    .middleware(['auth', 'isStudentProfileOwner'])
}).prefix('/v1')
