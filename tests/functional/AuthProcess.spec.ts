import { test } from '@japa/runner'
import supertest from 'supertest'
import User from '@Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `${process.env.API_URL}`
let userEmail: string = 'test@example.com'

test.group('AuthProcess', (group) => {
  group.setup(async () => {
    const connectionNode = Database.manager.get('mysql')
    console.log(connectionNode)
  })
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

    assert.exists(body.message)
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

    assert.exists(body.message)
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

    assert.exists(body.message)
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

  test('login with invalid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1235',
      })
      .expect(401)

    assert.exists(body.errors)
  })
  test('login with valid credentials', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'Password1234',
      })
      .expect(200)

    assert.exists(body.token)
  })

  // TODO : Faire des tests de ce que contient failedLoginAttempts lorsqu'il y a des tentatives de connexion infructueuses 
  // TODO : Et faire des tests quand on atteint le nombre max de tentatives de connexion infructueuses
})
