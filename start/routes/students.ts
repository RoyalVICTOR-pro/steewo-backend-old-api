import Route from '@ioc:Adonis/Core/Route'
import Role from '@Enums/Roles'

Route.group(() => {
  // STUDENT PROFILE CREATION
  Route.post('/student/register', 'StudentsProfileController.createStudentProfile').as(
    'createStudentProfile'
  )

  // GET STUDENT PROFILE
  Route.get(
    '/student/get-public-profile/:user_id',
    'StudentsProfileController.getStudentPublicProfile'
  )
    .as('getStudentPublicProfile')
    .middleware(['auth', 'isValidEmail'])

  Route.get(
    '/student/get-private-profile/:user_id',
    'StudentsProfileController.getStudentPrivateProfile'
  )
    .as('getStudentPrivateProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-private-profile-to-validate/:user_id',
    'StudentsProfileController.getStudentPrivateProfile'
  )
    .as('getStudentPrivateProfileToValidate')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  // STUDENT PROFILE UPDATE
  Route.patch(
    '/student/update-profile/:user_id/main',
    'StudentsProfileController.updateStudentProfileMainInfo'
  )
    .as('updateStudentProfileMainInfo')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-profile/:user_id/photo',
    'StudentsProfileController.updateStudentProfilePhoto'
  )
    .as('updateStudentProfilePhoto')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-profile/:user_id/banner',
    'StudentsProfileController.updateStudentProfileBanner'
  )
    .as('updateStudentProfileBanner')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-profile-photo/:student_profile_id',
    'StudentsProfileController.deleteStudentProfilePhoto'
  )
    .as('deleteStudentProfilePhoto')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-profile-banner/:student_profile_id',
    'StudentsProfileController.deleteStudentProfileBanner'
  )
    .as('deleteStudentProfileBanner')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-profile/:user_id/description',
    'StudentsProfileController.updateStudentProfileDescription'
  )
    .as('updateStudentProfileDescription')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT CHARTER
  Route.patch('/student/accept-charter/:user_id', 'StudentsProfileController.acceptStudentCharter')
    .as('acceptStudentCharter')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT VIEWS
  Route.get(
    '/student/get-views-count/:student_profile_id',
    'StudentsViewsAndBookmarksController.getStudentViewsCount'
  )
    .as('getStudentViewsCount')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/add-view-to-student-profile/:student_profile_id/from/:client_profile_id',
    'StudentsViewsAndBookmarksController.addViewToStudentProfile'
  )
    .as('addViewToStudentProfile')
    .middleware(['auth', 'isValidEmail'])

  // STUDENT BOOKMARKS
  Route.get(
    '/student/get-bookmarks-count/:student_profile_id',
    'StudentsViewsAndBookmarksController.getStudentBookmarksCount'
  )
    .as('getStudentBookmarksCount')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/toggle-student-profile-bookmark/:student_profile_id/from/:client_profile_id',
    'StudentsViewsAndBookmarksController.toggleStudentProfileBookmark'
  )
    .as('bookmarkStudentProfile')
    .middleware(['auth', 'isValidEmail'])

  Route.get(
    '/is-student-profile-bookmarked/:student_profile_id/from/:client_profile_id',
    'StudentsViewsAndBookmarksController.isStudentProfileBookmarked'
  )
    .as('isStudentProfileBookmarked')
    .middleware(['auth', 'isValidEmail'])

  // STUDENT PROFESSIONS
  Route.post(
    '/student/add-professions-to-profile/:student_profile_id',
    'StudentsProfessionsAndServicesController.addProfessionsToStudentProfile'
  )
    .as('addProfessionsToStudentProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-public-professions/:student_profile_id',
    'StudentsProfessionsAndServicesController.getStudentPublicProfessions'
  )
    .as('getStudentPublicProfessions')
    .middleware(['auth', 'isValidEmail'])

  Route.get(
    '/student/get-private-professions/:student_profile_id',
    'StudentsProfessionsAndServicesController.getStudentPrivateProfessions'
  )
    .as('getStudentPrivateProfessions')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT SERVICES
  Route.post(
    '/student/add-services-to-profile/:student_profile_id',
    'StudentsProfessionsAndServicesController.addServicesToStudentProfile'
  )
    .as('addServicesToStudentProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-public-services/:student_profile_id',
    'StudentsProfessionsAndServicesController.getStudentPublicServices'
  )
    .as('getStudentPublicServices')
    .middleware(['auth', 'isValidEmail'])

  Route.get(
    '/student/get-private-services/:student_profile_id',
    'StudentsProfessionsAndServicesController.getStudentPrivateServices'
  )
    .as('getStudentPrivateServicesle')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT ACHIEVEMENTS
  Route.post(
    '/student/add-achievements-to-profile/:student_profile_id',
    'StudentsAchievementsController.addAchievementsToStudentProfile'
  )
    .as('addAchievementsToStudentProfile')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.post(
    '/student/add-achievement-details-to-achievement/:achievement_id/by-student/:student_profile_id',
    'StudentsAchievementsController.addAchievementDetailsToAchievement'
  )
    .as('addAchievementDetailsToAchievement')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievement/:achievement_id/by-student/:student_profile_id',
    'StudentsAchievementsController.updateAchievement'
  )
    .as('updateAchievement')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievement-detail/:achievement_detail_id/by-student/:student_profile_id',
    'StudentsAchievementsController.updateAchievementDetail'
  )
    .as('updateAchievementDetail')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievements/:student_profile_id/order/:service_id',
    'StudentsAchievementsController.updateAchievementsOrder'
  )
    .as('updateAchievementsOrder')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.patch(
    '/student/update-achievement/:student_profile_id/details-order/:achievement_id',
    'StudentsAchievementsController.updateAchievementDetailsOrder'
  )
    .as('updateAchievementDetailsOrder')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-achievement/:achievement_id/by-student/:student_profile_id',
    'StudentsAchievementsController.deleteAchievement'
  )
    .as('deleteAchievement')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.delete(
    '/student/delete-achievement-detail/:achievement_detail_id/by-student/:student_profile_id',
    'StudentsAchievementsController.deleteAchievementDetail'
  )
    .as('deleteAchievementDetail')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  // STUDENT PROFILE VALIDATION
  Route.patch(
    '/student/ask-profile-validation/:student_profile_id',
    'StudentsProfileValidationProcessController.askProfileValidation'
  )
    .as('askProfileValidation')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-validation-requests',
    'StudentsProfileValidationProcessController.getValidationRequests'
  )
    .as('getValidationRequests')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  Route.post(
    '/student/reject-profile-validation/:student_profile_id',
    'StudentsProfileValidationProcessController.rejectProfileValidation'
  )
    .as('rejectProfileValidation')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  Route.patch(
    '/student/validate-profile/:student_profile_id',
    'StudentsProfileValidationProcessController.validateProfile'
  )
    .as('validateProfile')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  // NEW PROFESSION VALIDATION
  Route.patch(
    '/student/:student_profile_id/ask-new-profession-validation/:profession_id',
    'StudentsProfileValidationProcessController.askNewProfessionValidation'
  )
    .as('askNewProfessionValidation')
    .middleware(['auth', 'isStudentProfileOwner', 'isValidEmail'])

  Route.get(
    '/student/get-professions-validation-requests',
    'StudentsProfileValidationProcessController.getProfessionsValidationRequests'
  )
    .as('getProfessionsValidationRequests')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  Route.post(
    '/student/:student_profile_id/reject-new-profession-validation/:profession_id',
    'StudentsProfileValidationProcessController.rejectNewProfessionValidation'
  )
    .as('rejectNewProfessionValidation')
    .middleware(['auth', `role:${[Role.ADMIN]}`])

  Route.patch(
    '/student/:student_profile_id/validate-new-profession/:profession_id',
    'StudentsProfileValidationProcessController.validateNewProfession'
  )
    .as('validateNewProfession')
    .middleware(['auth', `role:${[Role.ADMIN]}`])
}).prefix('/v1')
