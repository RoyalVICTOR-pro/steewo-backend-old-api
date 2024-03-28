import Route from '@ioc:Adonis/Core/Route'
import Role from '@Enums/Roles'

Route.group(() => {
  // STUDENT PROFILE CREATION
  Route.post('/student/register', 'StudentsController.createStudentProfile').as(
    'createStudentProfile'
  )

  // GET STUDENT PROFILE
  Route.get('/student/get-public-profile/:user_id', 'StudentsController.getStudentPublicProfile')
    .as('getStudentPublicProfile')
    .middleware(['auth', 'isValidEmail'])

  Route.get('/student/get-private-profile/:user_id', 'StudentsController.getStudentPrivateProfile')
    .as('getStudentPrivateProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-private-profile-to-validate/:user_id',
    'StudentsController.getStudentPrivateProfile'
  )
    .as('getStudentPrivateProfile')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  // STUDENT PROFILE UPDATE
  Route.patch(
    '/student/update-profile/:user_id/main',
    'StudentsController.updateStudentProfileMainInfo'
  )
    .as('updateStudentProfileMainInfo')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-profile/:user_id/photo',
    'StudentsController.updateStudentProfilePhoto'
  )
    .as('updateStudentProfilePhoto')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-profile/:user_id/banner',
    'StudentsController.updateStudentProfileBanner'
  )
    .as('updateStudentProfileBanner')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-profile-photo/:student_profile_id',
    'StudentsController.deleteStudentProfilePhoto'
  )
    .as('deleteStudentProfilePhoto')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-profile-banner/:student_profile_id',
    'StudentsController.deleteStudentProfileBanner'
  )
    .as('deleteStudentProfileBanner')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-profile/:user_id/description',
    'StudentsController.updateStudentProfileDescription'
  )
    .as('updateStudentProfileDescription')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT CHARTER
  Route.patch('/student/accept-charter/:user_id', 'StudentsController.acceptStudentCharter')
    .as('acceptStudentCharter')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT VIEWS
  Route.get(
    '/student/get-views-count/:student_profile_id',
    'StudentsController.getStudentViewsCount'
  )
    .as('getStudentViewsCount')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/add-view-to-student-profile/:student_profile_id/from/:client_profile_id',
    'StudentsController.addViewToStudentProfile'
  )
    .as('addViewToStudentProfile')
    .middleware(['auth', 'isValidEmail'])

  // STUDENT BOOKMARKS
  Route.get(
    '/student/get-bookmarks-count/:student_profile_id',
    'StudentsController.getStudentBookmarksCount'
  )
    .as('getStudentBookmarksCount')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/toggle-student-profile-bookmark/:student_profile_id/from/:client_profile_id',
    'StudentsController.toggleStudentProfileBookmark'
  )
    .as('bookmarkStudentProfile')
    .middleware(['auth', 'isValidEmail'])

  Route.get(
    '/is-student-profile-bookmarked/:student_profile_id/from/:client_profile_id',
    'StudentsController.isStudentProfileBookmarked'
  )
    .as('isStudentProfileBookmarked')
    .middleware(['auth', 'isValidEmail'])

  // STUDENT PROFESSIONS
  Route.post(
    '/student/add-professions-to-profile/:student_profile_id',
    'StudentsController.addProfessionsToStudentProfile'
  )
    .as('addProfessionsToStudentProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-public-professions/:student_profile_id',
    'StudentsController.getStudentPublicProfessions'
  )
    .as('getStudentPublicProfessions')
    .middleware(['auth'])

  Route.get(
    '/student/get-private-professions/:student_profile_id',
    'StudentsController.getStudentPrivateProfessions'
  )
    .as('getStudentPrivateProfessions')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT SERVICES
  Route.post(
    '/student/add-services-to-profile/:student_profile_id',
    'StudentsController.addServicesToStudentProfile'
  )
    .as('addServicesToStudentProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get('/student/get-services/:student_profile_id', 'StudentsController.getStudentServices')
    .as('getStudentServices')
    .middleware(['auth'])

  // STUDENT ACHIEVEMENTS
  Route.post(
    '/student/add-achievements-to-profile/:student_profile_id',
    'StudentsController.addAchievementsToStudentProfile'
  )
    .as('addAchievementsToStudentProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.post(
    '/student/add-achievement-details-to-achievement/:achievement_id/by-student/:student_profile_id',
    'StudentsController.addAchievementDetailsToAchievement'
  )
    .as('addAchievementDetailsToAchievement')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievement/:achievement_id/by-student/:student_profile_id',
    'StudentsController.updateAchievement'
  )
    .as('updateAchievement')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievement-detail/:achievement_detail_id/by-student/:student_profile_id',
    'StudentsController.updateAchievementDetail'
  )
    .as('updateAchievementDetail')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievements/:student_profile_id/order/:service_id',
    'StudentsController.updateAchievementsOrder'
  )
    .as('updateAchievementsOrder')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievement/:student_profile_id/details-order/:achievement_id',
    'StudentsController.updateAchievementDetailsOrder'
  )
    .as('updateAchievementDetailsOrder')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-achievement/:achievement_id/by-student/:student_profile_id',
    'StudentsController.deleteAchievement'
  )
    .as('deleteAchievement')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-achievement-detail/:achievement_detail_id/by-student/:student_profile_id',
    'StudentsController.deleteAchievementDetail'
  )
    .as('deleteAchievementDetail')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT PROFILE VALIDATION
  Route.patch(
    '/student/ask-profile-validation/:student_profile_id',
    'StudentsController.askProfileValidation'
  )
    .as('askProfileValidation')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch('/student/validate-profile/:student_profile_id', 'StudentsController.validateProfile')
    .as('validateProfile')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  Route.get('/student/get-validation-requests', 'StudentsController.getValidationRequests')
    .as('getValidationRequests')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  Route.post(
    '/student/reject-profile-validation/:student_profile_id',
    'StudentsController.rejectProfileValidation'
  )
    .as('rejectProfileValidation')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
}).prefix('/v1')
