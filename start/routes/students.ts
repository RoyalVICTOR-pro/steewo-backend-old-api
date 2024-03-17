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
  Route.delete(
    '/delete-student-profile-photo/:student_profile_id',
    'StudentsController.deleteStudentProfilePhoto'
  )
    .as('deleteStudentProfilePhoto')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.delete(
    '/delete-student-profile-banner/:student_profile_id',
    'StudentsController.deleteStudentProfileBanner'
  )
    .as('deleteStudentProfileBanner')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.patch(
    '/update-student-profile/:user_id/description',
    'StudentsController.updateStudentProfileDescription'
  )
    .as('updateStudentProfileDescription')
    .middleware(['auth', 'isStudentProfileOwner'])

  Route.patch('/accept-student-charter/:user_id', 'StudentsController.acceptStudentCharter')
    .as('acceptStudentCharter')
    .middleware(['auth', 'isStudentProfileOwner'])

  Route.get('/get-student-views-count/', 'StudentsController.getStudentViewsCount')
    .as('getStudentViewsCount')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.get(
    '/add-view-to-student-profile/:student_profile_id/from/:client_profile_id',
    'StudentsController.addViewToStudentProfile'
  )
    .as('addViewToStudentProfile')
    .middleware('auth')

  Route.get('/get-student-bookmarks-count/', 'StudentsController.getStudentBookmarksCount')
    .as('getStudentBookmarksCount')
    .middleware(['auth', 'isStudentProfileOwner'])
  Route.get(
    '/toggle-student-profile-bookmark/:student_profile_id/from/:client_profile_id',
    'StudentsController.toggleStudentProfileBookmark'
  )
    .as('bookmarkStudentProfile')
    .middleware('auth')
  Route.get(
    '/is-student-profile-bookmarked/:student_profile_id/from/:client_profile_id',
    'StudentsController.isStudentProfileBookmarked'
  )
    .as('isStudentProfileBookmarked')
    .middleware('auth')
}).prefix('/v1')
