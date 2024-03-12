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
  Route.patch(
    '/update-student-profile/:user_id/main',
    'StudentsController.updateStudentProfileMainInfo'
  )
    .as('updateStudentProfileMainInfo')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.patch(
    '/update-student-profile/:user_id/photo',
    'StudentsController.updateStudentProfilePhoto'
  )
    .as('updateStudentProfilePhoto')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.patch(
    '/update-student-profile/:user_id/banner',
    'StudentsController.updateStudentProfileBanner'
  )
    .as('updateStudentProfileBanner')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.patch(
    '/update-student-profile/:user_id/description',
    'StudentsController.updateStudentProfileDescription'
  )
    .as('updateStudentProfileDescription')
    .middleware(['auth', 'isStudentProfileOwner'])
}).prefix('/v1')
