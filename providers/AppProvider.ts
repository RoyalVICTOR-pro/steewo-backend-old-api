import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { AuthController } from 'App/Controllers/Http/AuthController'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const { AuthController } = await import('../app/Controllers/Http/AuthController')
    const authController = this.app.container.make(AuthController)

    console.log('authController :>> ', authController)
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
