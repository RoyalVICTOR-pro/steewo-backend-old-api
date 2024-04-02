// ADONIS
import { test } from '@japa/runner'
import Drive from '@ioc:Adonis/Core/Drive'
import supertest from 'supertest'
// ENUMS
import Role from '@Enums/Roles'
import ClientUserStatus from '@Enums/ClientUserStatus'
// HELPERS
import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import Gender from 'App/Enums/Gender'

const BASE_URL = `${process.env.TEST_API_URL}`
const TESTS_FILES_PATH = './tests/functional/files_for_tests/'
const clientPhotoPath1 = TESTS_FILES_PATH + 'red_img_test_100x100.jpg'
// const clientPhotoPath2 = TESTS_FILES_PATH + 'orange_img_test_200x200.jpg'

test.group('Individual Client Profile Creation Process', (group) => {
  let fakeClient = new FakeClientForTest()
  let fakeStudent = new FakeStudentForTest()

  group.setup(async () => {
    await fakeClient.registerFakeClient()
    await fakeStudent.createFakeStudentUserAccount()
    await fakeStudent.validateStudentEmail()
    await fakeStudent.loginFakeStudent()
  })

  group.teardown(async () => {
    await fakeClient.deleteFakeClient()
    await fakeStudent.deleteFakeStudent()
  })
  test('Register individual client without user id', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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
      .post('/client/register-individual')
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

  test('Get individual private client profile without authentication', async () => {
    await supertest(BASE_URL)
      .get('/client/get-private-profile/' + fakeClient.userId)
      .expect(401)
  })
  test('Get individual public client profile without authentication', async () => {
    await supertest(BASE_URL)
      .get('/client/get-public-profile/' + fakeClient.userId)
      .expect(401)
  })

  test('Get individual private client profile with student authentication', async ({ client }) => {
    const response = await client
      .get('/client/get-private-profile/' + fakeClient.userId)
      .header('Cookie', fakeStudent.tokenCookie)

    response.assertStatus(401)
  })

  test('Get individual public client profile with student authentication', async ({ client }) => {
    const response = await client
      .get('/client/get-public-profile/' + fakeClient.userId)
      .header('Cookie', fakeStudent.tokenCookie)

    response.assertStatus(200)
  })

  test('Get individual private client profile by the client himself', async ({ client }) => {
    const response = await client
      .get('/client/get-private-profile/' + fakeClient.userId)
      .header('Cookie', fakeClient.tokenCookie)

    response.assertStatus(200)
  })

  test('Update individual client profile main info without authentication', async () => {
    await supertest(BASE_URL)
      .patch('/client/update-profile/' + fakeClient.userId + '/main')
      .send({
        date_of_birth: '1985-03-21',
        firstname: 'Théo',
        lastname: 'Long',
        gender: Gender.MALE,
        address_city: 'Paris',
        address_number: '12',
        address_postal_code: '75001',
        address_road: 'rue de la paix',
        phone: '0687654321',
      })
      .expect(401)
  })

  test('Update individual client profile main info', async ({ client, assert }) => {
    await fakeClient.loginFakeClient()
    const response = await client
      .patch('/client/update-profile/' + fakeClient.userId + '/main')
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        date_of_birth: '1985-03-21',
        firstname: 'Théo',
        lastname: 'Long',
        gender: Gender.MALE,
        address_city: 'Paris',
        address_number: '12',
        address_postal_code: '75001',
        address_road: 'rue de la paix',
        phone: '0687654321',
      })

    response.assertStatus(200)

    assert.equal(response.body().address_city, 'Paris')
    assert.equal(response.body().address_number, '12')
    assert.equal(response.body().address_postal_code, '75001')
    assert.equal(response.body().address_road, 'rue de la paix')
    assert.equal(response.body().phone, '0687654321')
  })

  test('Update individual client profile photo without authentication', async () => {
    await supertest(BASE_URL)
      .patch('/client/update-profile/' + fakeClient.userId + '/photo')
      .expect(401)
  })

  test('Update individual client profile photo by a student', async ({ client }) => {
    const response = await client
      .patch('/client/update-profile/' + fakeClient.userId + '/photo')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('photo_file', clientPhotoPath1)

    response.assertStatus(401)
  })

  test('Update individual client profile photo by the client himself', async ({
    client,
    assert,
  }) => {
    const response = await client
      .patch('/client/update-profile/' + fakeClient.userId + '/photo')
      .header('Cookie', fakeClient.tokenCookie)
      .file('photo_file', clientPhotoPath1)

    response.assertStatus(200)
    const photoPath = response.body().photo_file
    assert.equal(await Drive.exists(photoPath), true)
  })

  test('Update individual client profile description without authentication', async () => {
    await supertest(BASE_URL)
      .patch('/client/update-profile/' + fakeClient.userId + '/description')
      .send({
        description: 'Je suis un client individuel',
      })
      .expect(401)
  })

  test('Update individual client profile description by a student', async ({ client }) => {
    const response = await client
      .patch('/client/update-profile/' + fakeClient.userId + '/description')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        description: 'Je suis un client individuel',
      })

    response.assertStatus(401)
  })

  test('Update individual client profile description by the client himself', async ({
    client,
    assert,
  }) => {
    const response = await client
      .patch('/client/update-profile/' + fakeClient.userId + '/description')
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        description: 'Je suis un client individuel',
      })

    response.assertStatus(200)
    assert.equal(response.body().description, 'Je suis un client individuel')
  })

  test('Accept client charter without authentication', async () => {
    await supertest(BASE_URL)
      .patch('/client/accept-charter/' + fakeClient.userId)
      .send({
        has_accepted_steewo_charter: true,
      })
      .expect(401)
  })

  test('Accept client charter by a student', async ({ client }) => {
    const response = await client
      .patch('/client/accept-charter/' + fakeClient.userId)
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        has_accepted_steewo_charter: true,
      })

    response.assertStatus(401)
  })

  test('Accept client charter by the client himself', async ({ client, assert }) => {
    const response = await client
      .patch('/client/accept-charter/' + fakeClient.userId)
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        has_accepted_steewo_charter: true,
      })

    response.assertStatus(200)
    assert.equal(response.body().has_accepted_steewo_charter, true)
  })
})
