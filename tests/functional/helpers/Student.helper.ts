import supertest from 'supertest'
import User from '@Models/User'
import StudentProfile from '@Models/StudentProfile'

export class FakeStudentForTest {
  public email: string = 'fabien.garp@tests.com'
  private password: string = 'FakeStudent1234'
  private passwordConfirmation: string = 'FakeStudent1234'
  private BASE_URL = `${process.env.TEST_API_URL}`
  public userId: number
  public createdUser: User
  public tokenCookie: string

  public async registerFakeStudent() {
    let { body: createdUser } = await supertest(this.BASE_URL)
      .post('/register')
      .send({
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
      })
      .expect(201)

    this.userId = createdUser.id
    this.createdUser = createdUser
  }

  public async loginFakeStudent() {
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

  public async validateStudentEmail() {
    await User.query().where('id', this.userId).update({ is_valid_email: 1 })
  }

  public async deleteFakeStudent() {
    await StudentProfile.query().where('user_id', this.userId).delete()
    await User.query().where('id', this.userId).delete()
  }
}
