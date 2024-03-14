import { DateTime } from 'luxon'
import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import { test } from '@japa/runner'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
import supertest from 'supertest'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group('Student Profile Completion Process', (group) => {
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
    await secondFakeStudent.deleteFakeStudent()
    await fakeClient.deleteFakeClient()
  })

  test('Get Student Public Profile by a client before profile registration', async ({ client }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(404)
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
    console.log('Student Profile created:', body)
    console.log('Student Profile ID:', body.id)
    fakeStudent.studentProfileId = body.id
  })

  test('Get Student Public Profile by an unauthenticated user', async ({ client }) => {
    const response = await client.get('/get-student-public-profile/' + fakeStudent.userId)
    response.assertStatus(401)
  })
  test('Get Student Public Profile by a client before getting validated by Steewo', async ({
    client,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(403)
  })
  test('Get Student Public Profile by a client after getting validated by Steewo', async ({
    client,
    assert,
  }) => {
    await fakeStudent.validateStudentProfile()
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      firstname: 'Fabien',
      lastname: 'Garp',
      current_diploma: 'Directeur graphique',
      current_school: 'MJM Graphic Design',
      last_diploma: 'Bac Scientifique',
      last_diploma_school: 'Lycée Condorcet',
    })
    assert.notInclude(response.body, { date_of_birth: DateTime.fromISO('1984-08-24').toISO() })
  })
  test('Get Student Private Profile by a client', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })
  test('Get Student Private Profile by an other student', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Private Profile by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      firstname: 'Fabien',
      lastname: 'Garp',
      current_diploma: 'Directeur graphique',
      current_school: 'MJM Graphic Design',
      last_diploma: 'Bac Scientifique',
      last_diploma_school: 'Lycée Condorcet',
      date_of_birth: DateTime.fromISO('1984-08-24').toISO(),
    })
  })
})
