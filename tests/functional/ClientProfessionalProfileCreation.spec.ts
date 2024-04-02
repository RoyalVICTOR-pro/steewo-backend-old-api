// ADONIS
import { test } from '@japa/runner'
import supertest from 'supertest'
// ENUMS
import Role from '@Enums/Roles'
import ClientUserStatus from '@Enums/ClientUserStatus'
// HELPERS
import { FakeClientForTest } from './helpers/Client.helper'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group('Professional Client Profile Creation Process', (group) => {
  let fakeClient = new FakeClientForTest()

  group.setup(async () => {
    await fakeClient.registerFakeClient()
  })

  group.teardown(async () => {
    await fakeClient.deleteFakeClient()
  })
  test('Register professional client without user id', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: '',
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without firstname', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: '',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without lastname', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: '',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without date_of_birth', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client with wrong format date_of_birth', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '21/03/1985',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without company name', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: '',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without position', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: '',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without siret number', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without CGV Acceptation', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client without Privacy Policy Acceptation', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register professional client with valid data', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-professional')
      .send({
        user_id: fakeClient.userId,
        role: Role.CLIENT_PROFESSIONAL,
        status: ClientUserStatus.ACCOUNT_CREATED,
        firstname: 'Théo',
        lastname: 'Long',
        phone: '0612345678',
        date_of_birth: '1985-03-21',
        company_name: 'DesignHarmony Interiors',
        position: 'Directeur',
        siret_number: '12345678912345',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(201)

    assert.exists(body)
  })

  test('Get all private professions with logged simple user role with is_valid_email = 0', async ({
    client,
  }) => {
    await fakeClient.loginFakeClient()
    const response = await client.get('/professions').header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Get all public professions with logged simple user role with is_valid_email = 0', async ({
    client,
  }) => {
    await fakeClient.loginFakeClient()
    const response = await client
      .get('/public-professions')
      .header('Cookie', fakeClient.tokenCookie)
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

  test('Get all private professions with logged simple user role with is_valid_email = 1', async ({
    client,
  }) => {
    const response = await client.get('/professions').header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Get all public professions with logged simple user role with is_valid_email = 1', async ({
    client,
  }) => {
    const response = await client
      .get('/public-professions')
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })
})
