import { test } from '@japa/runner'
import supertest from 'supertest'
import { FakeClientForTest } from './helpers/Client.helper'
import Role from '@Enums/Roles'
import ClientUserStatus from '@Enums/ClientUserStatus'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group('Individual Client Profile Creation Process', (group) => {
  let fakeClient = new FakeClientForTest()

  group.setup(async () => {
    await fakeClient.registerFakeClient()
  })

  group.teardown(async () => {
    await fakeClient.deleteFakeClient()
  })
  test('Register individual client without user id', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: '',
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without firstname', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: '',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without lastname', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: '',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without date_of_birth', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client with wrong format date_of_birth', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '21/03/1985',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without address number', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without address road', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: '',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without address city', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: '',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without address postal code', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without CGV Acceptation', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client without Privacy Policy Acceptation', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register individual client with valid data', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-individual-client')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_INDIVIDUAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        address_number: '15',
        address_road: 'rue du 11 novembre 1918',
        address_postal_code: '93250',
        address_city: 'Villemomble',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(201)

    assert.exists(body)
  })
  test('Get all professions with logged simple user role with is_valid_email = 0', async ({
    client,
  }) => {
    await fakeClient.loginFakeClient()
    const response = await client.get('/professions').header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })
  test('Validate Client Email with wrong token', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .get('/validate-email/123456789/' + fakeClient.email)
      .expect(401)

    assert.exists(body)
  })
  test('Validate Client Email with a good token', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .get(
        '/validate-email/' + fakeClient.createdUser.email_validation_token + '/' + fakeClient.email
      )
      .expect(200)

    assert.exists(body)
  })
  test('Get all professions with logged simple user role with is_valid_email = 1', async ({
    client,
  }) => {
    const response = await client.get('/professions').header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })
})
