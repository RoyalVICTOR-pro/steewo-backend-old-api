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
  public tokenCookie: string
  public adminTokenCookie: string

  public async registerAndLoginFakeUser() {
    console.log('là')
    let { body: createdUser } = await supertest(this.BASE_URL)
      .post('/register')
      .send({
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      })
      .expect(201)

    this.userId = createdUser.id

    const authResponse = await supertest(this.BASE_URL)
      .post('/login')
      .send({
        email: this.email,
        password: this.password,
      })
      .expect(200)

    this.tokenCookie = authResponse.headers['set-cookie'][0]
    return this.tokenCookie
  }

  public async loginAdminUser() {
    const authResponse = await supertest(this.BASE_URL)
      .post('/login')
      .send({
        email: this.ADMIN_EMAIL,
        password: this.ADMIN_PASSWORD,
      })
      .expect(200)

    this.adminTokenCookie = authResponse.headers['set-cookie'][0]
    return this.adminTokenCookie
  }

  public async deleteFakeUser() {
    await User.query().where('id', this.userId).delete()
  }
}
