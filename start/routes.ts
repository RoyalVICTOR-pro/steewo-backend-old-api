import AutoSwagger from 'adonis-autoswagger'
import swagger from 'Config/swagger'
import Route from '@ioc:Adonis/Core/Route'

// returns swagger in YAML
Route.get('/swagger', async () => {
  return AutoSwagger.docs(Route.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
Route.get('/docs', async () => {
  return AutoSwagger.ui('/swagger', swagger)
})

import './routes/auth'
import './routes/clients'
import './routes/formfields'
import './routes/professions'
import './routes/services'
import './routes/students'
