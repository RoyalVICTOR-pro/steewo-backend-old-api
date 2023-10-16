import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings

    // Le default : AuthController a été très important pour que le container puisse instancier la classe
    // et que la méthode register soit trouvée
    const { default: AuthController } = await import('../app/Controllers/Http/AuthController')
    this.app.container.make(AuthController)
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
