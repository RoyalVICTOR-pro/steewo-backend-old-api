import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    // Register your own bindings
    await this.setupDependancyInjectionBindings()
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

  private async setupDependancyInjectionBindings() {
    const { UserRepository } = await import('App/DataAccessLayer/Repositories/UserRepository')
    const { AuthService } = await import('App/Services/AuthService')
    const { AuthController } = await import('App/Controllers/Http/AuthController')

    this.app.container.singleton(
      'App/DataAccessLayer/DALContracts/UserContract',
      () => new UserRepository()
    )

    this.app.container.singleton('App/Services/AuthService', () => {
      const userRepository = this.app.container.use('App/DataAccessLayer/DALContracts/UserContract')
      return new AuthService(userRepository)
    })

    this.app.container.singleton('App/Controllers/Http/AuthController', () => {
      const service = this.app.container.use('App/Services/AuthService')
      return new AuthController(service)
    })
  }
}
