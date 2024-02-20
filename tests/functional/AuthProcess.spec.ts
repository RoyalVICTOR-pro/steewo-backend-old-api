import { test } from '@japa/runner'
import supertest from 'supertest'
import User from '@Models/User'
import FailedLoginAttempt from '@Models/FailedLoginAttempt'
// import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `${process.env.TEST_API_URL}`
let userEmail: string = 'test@example.com'
const ADMIN_EMAIL = `${process.env.ADMIN_EMAIL_FOR_TESTS}`
const ADMIN_PASSWORD = `${process.env.ADMIN_PASSWORD_FOR_TESTS}`

test.group('AuthProcess', (group) => {
  // group.setup(async () => {
  //   const connectionNode = Database.manager.get('mysql')
  //   console.log(connectionNode)
  // })
  group.teardown(async () => {
    await User.query().where('email', userEmail).delete()
  })
  test('register returns an error with invalid email', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register')
      .send({
        email: 'test@example',
        password: 'Password1234',
        password_confirmation: 'Password1234',
      })
      .expect(422)

    assert.exists(body)
  })
  test('register returns an error with invalid password', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      })
      .expect(422)

    assert.exists(body)
  })

  test('register returns an error with differents password and password_confirmation', async ({
    assert,
  }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'Password1234',
        password_confirmation: 'Password1235',
      })
      .expect(422)

    assert.exists(body)
  })

  test('register creates a new user with valid data', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register')
      .send({
        email: userEmail,
        password: 'Password1234',
        password_confirmation: 'Password1234',
      })
      .expect(201)

    assert.exists(body.id)
    assert.equal(body.email, 'test@example.com')
  })

  test('login with valid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1234',
      })
      .expect(200)

    assert.exists(body.user)
  })

  test('login with invalid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1235',
      })
      .expect(401)

    assert.exists(body)
  })
  test('login with invalid credentials second time', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1235',
      })
      .expect(401)

    assert.exists(body)
  })
  test('login with invalid credentials third time', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1235',
      })
      .expect(401)

    assert.exists(body)
  })

  test('login with invalid credentials fourth time will fail with too many attempts', async () => {
    await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1235',
      })
      .expect(429)

    await FailedLoginAttempt.query().where('email', userEmail).delete()
    await FailedLoginAttempt.query().where('email', 'test_admin@example.com').delete()
  })

  test('admin login with simple user valid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/login')
      .send({
        email: 'test@example.com',
        password: 'Password1234',
      })
      .expect(403)

    assert.exists(body)
  })

  test('admin login with invalid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/login')
      .send({
        email: 'test_admin@example.com',
        password: 'Password1235',
      })
      .expect(401)

    assert.exists(body)
  })

  test('admin login with valid admin credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/login')
      .send({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      })
      .expect(200)

    assert.exists(body.user)
  })
})
