import { test } from '@japa/runner'
import supertest from 'supertest'
import User from '@Models/User'
// import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `${process.env.TEST_API_URL}`
let userEmail: string = 'test@example.com'
let userPasswordResetToken: string

test.group('Password Forgot Process', (group) => {
  group.teardown(async () => {
    await User.query().where('email', userEmail).delete()
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
        email: userEmail,
        password: 'Password1234',
      })
      .expect(200)

    assert.exists(body.user)
    assert.equal(body.user.password_reset_token, null)
  })

  test('Asking for new password with email', async () => {
    await supertest(BASE_URL)
      .post('/forgot-password')
      .send({
        email: userEmail,
      })
      .expect(200)
  })
  test('login to get the token', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: userEmail,
        password: 'Password1234',
      })
      .expect(200)

    assert.exists(body.user)
    assert.notEqual(body.user.password_reset_token, null)
    userPasswordResetToken = body.user.password_reset_token
  })
  test('reseting password with invalid token', async () => {
    await supertest(BASE_URL)
      .post('/reset-password/123456789/' + userEmail)
      .send({
        password: 'Password1235',
        password_confirmation: 'Password1235',
      })
      .expect(401)
  })
  test('reseting password with invalid email', async () => {
    await supertest(BASE_URL)
      .post('/reset-password/' + userPasswordResetToken + '/test@test.com')
      .send({
        password: 'Password1235',
        password_confirmation: 'Password1235',
      })
      .expect(404)
  })
  test('reseting password with invalid password format', async () => {
    await supertest(BASE_URL)
      .post('/reset-password/' + userPasswordResetToken + '/' + userEmail)
      .send({
        password: 'pass',
        password_confirmation: 'pass',
      })
      .expect(422)
  })
  test('reseting password with invalid password confirmation', async () => {
    await supertest(BASE_URL)
      .post('/reset-password/' + userPasswordResetToken + '/' + userEmail)
      .send({
        password: 'Password1235',
        password_confirmation: 'Password1234',
      })
      .expect(422)
  })
  test('reseting password with valid token and email', async () => {
    await supertest(BASE_URL)
      .post('/reset-password/' + userPasswordResetToken + '/' + userEmail)
      .send({
        password: 'Password1235',
        password_confirmation: 'Password1235',
      })
      .expect(200)
  })

  test('login with valid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: userEmail,
        password: 'Password1235',
      })
      .expect(200)

    assert.exists(body.user)
    assert.equal(body.user.password_reset_token, null)
  })
})
