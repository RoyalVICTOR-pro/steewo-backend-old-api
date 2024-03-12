import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/register', 'AuthController.register').as('register')
  Route.post('/login', 'AuthController.login').as('login')
  Route.post('/admin/login', 'AuthController.loginAsAdmin').as('loginAsAdmin')
  Route.get('/me', 'AuthController.me').as('me')
  Route.get('/me-as-admin', 'AuthController.meAsAdmin').as('meAsAdmin')
  Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth')
  Route.get('validate-email/:token/:email', 'AuthController.validateEmail').as('validateEmail')
  Route.post('/forgot-password', 'AuthController.forgotPassword').as('forgotPassword')
  Route.post('/reset-password/:token/:email', 'AuthController.resetPassword').as('resetPassword')
}).prefix('/v1')
