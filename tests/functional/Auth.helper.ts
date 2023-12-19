import supertest from 'supertest'
import User from '@Models/User'

export class FakeUserForTest {
  private email: string = 'fake.user@tests.com'
  private password: string = 'FakeUser1234'
  private passwordConfirmation: string = 'FakeUser1234'
  private BASE_URL = `${process.env.TEST_API_URL}`
  private ADMIN_EMAIL = `${process.env.ADMIN_EMAIL_FOR_TESTS}`
  private ADMIN_PASSWORD = `${process.env.ADMIN_PASSWORD_FOR_TESTS}`
  private userId: number
  public token: string
  public adminToken: string

  public async registerAndLoginFakeUser() {
    let { body: createdUser } = await supertest(this.BASE_URL)
      .post('/register')
      .send({
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      })
      .expect(201)

    this.userId = createdUser.id

    let { body: loggedUser } = await supertest(this.BASE_URL)
      .post('/login')
      .send({
        email: this.email,
        password: this.password,
      })
      .expect(200)

    this.token = loggedUser.loginResponse.token
    return this.token
  }

  public async loginAdminUser() {
    let { body: loggedUser } = await supertest(this.BASE_URL)
      .post('/login')
      .send({
        email: this.ADMIN_EMAIL,
        password: this.ADMIN_PASSWORD,
      })
      .expect(200)

    this.adminToken = loggedUser.loginResponse.token
    return this.adminToken
  }

  public async deleteFakeUser() {
    await User.query().where('id', this.userId).delete()
  }
}
