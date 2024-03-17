import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import { test } from '@japa/runner'
import ClientUserStatus from '@Enums/ClientUserStatus'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
import supertest from 'supertest'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group('Student Profile Bookmarks and views', (group) => {
  let fakeStudent = new FakeStudentForTest()
  let secondFakeStudent = new FakeStudentForTest('arya.stark@winterfell.com')
  let fakeClient = new FakeClientForTest()

  group.setup(async () => {
    await fakeClient.registerFakeClient()
    await fakeClient.validateClientEmail()
    await fakeClient.loginFakeClient()
    await fakeStudent.registerFakeStudent()
    await fakeStudent.validateStudentEmail()
    await fakeStudent.loginFakeStudent()
    await secondFakeStudent.registerFakeStudent()
    await secondFakeStudent.validateStudentEmail()
    await secondFakeStudent.loginFakeStudent()
  })

  group.teardown(async () => {
    await fakeStudent.deleteFakeStudent()
    await fakeStudent.deleteRegisteredViews()
    await fakeStudent.deleteRegisteredBookmarks()
    await secondFakeStudent.deleteFakeStudent()
    await fakeClient.deleteFakeClient()
  })

  test('Register student with valid data', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(201)

    assert.exists(body)
    fakeStudent.studentProfileId = body.id
    await fakeStudent.validateStudentProfile()
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
    fakeClient.clientProfileId = body.id
  })

  test('Get Student Views Count by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      nb_views: 0,
    })
  })

  test('Add View to Student Profile by a client', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })

  test('Add a second view to Student Profile by a same client', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(400)
  })

  test('Add View to Student Profile by an other student', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          secondFakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(400)
  })

  test('Add View to Student Profile by the student himself', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(400)
  })

  test('Get Student Views Count by a client', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Views Count by an other student', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Views Count by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      nb_views: 1,
    })
  })

  test('Get Student Bookmarks Count by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-bookmarks-count/')
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      nb_bookmarks: 0,
    })
  })

  test('Toggle Student Profile Bookmark by a client', async ({ client }) => {
    const response = await client
      .get(
        '/toggle-student-profile-bookmark/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })

  test('Toggle Student Profile Bookmark by an other student', async ({ client }) => {
    const response = await client
      .get(
        '/toggle-student-profile-bookmark/' +
          fakeStudent.studentProfileId +
          '/from/' +
          secondFakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(400)
  })

  test('Toggle Student Profile Bookmark by the student himself', async ({ client }) => {
    const response = await client
      .get(
        '/toggle-student-profile-bookmark/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(400)
  })

  test('Get Student Bookmarks Count by a client', async ({ client }) => {
    const response = await client
      .get('/get-student-bookmarks-count/')
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Bookmarks Count by an other student', async ({ client }) => {
    const response = await client
      .get('/get-student-bookmarks-count/')
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Bookmarks Count by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-bookmarks-count/')
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      nb_bookmarks: 1,
    })
  })

  test('Check if Student Profile is bookmarked by a client', async ({ client, assert }) => {
    const response = await client
      .get(
        '/is-student-profile-bookmarked/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
    assert.equal(response.body().answer, true)
  })

  test('Toggle Student Profile Bookmark by a client', async ({ client }) => {
    const response = await client
      .get(
        '/toggle-student-profile-bookmark/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })

  test('Check if Student Profile is bookmarked by a client', async ({ client, assert }) => {
    const response = await client
      .get(
        '/is-student-profile-bookmarked/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
    assert.equal(response.body().answer, false)
  })

  test('Get Student Bookmarks Count by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-bookmarks-count/')
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      nb_bookmarks: 0,
    })
  })
})
