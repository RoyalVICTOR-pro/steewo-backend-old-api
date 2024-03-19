import { DateTime } from 'luxon'
import { FakeStudentForTest } from './helpers/Student.helper'
import { test } from '@japa/runner'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group('Student Profile Creation Process', (group) => {
  let fakeStudent = new FakeStudentForTest()

  group.setup(async () => {
    await fakeStudent.createFakeStudentUserAccount()
  })

  group.teardown(async () => {
    await fakeStudent.deleteFakeStudent()
  })
  test('Register student without user id', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: '',
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: '',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without firstname', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: '',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without lastname', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: '',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without date_of_birth', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student with wrong format date_of_birth', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '24/08/1984',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without current diploma', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: '',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without current diploma school', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: '',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without CGV Acceptation', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '2024-08-24 11:48:12',
        cgv_acceptation: '',
      })
      .expect(422)

    assert.exists(body)
  })
  test('Register student without Privacy Policy Acceptation', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/register-student')
      .send({
        user_id: fakeStudent.userId,
        role: Role.STUDENT,
        status: StudentUserStatus.ACCOUNT_CREATED,
        firstname: 'Fabien',
        lastname: 'Garp',
        mobile: '0612345678',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        privacy_acceptation: '',
        cgv_acceptation: '2024-08-24 11:48:12',
      })
      .expect(422)

    assert.exists(body)
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
  })
  test('Check Student User Data', async ({ assert }) => {
    const studentUserInfos = await User.find(fakeStudent.userId)
    if (studentUserInfos) {
      assert.equal(studentUserInfos.role, Role.STUDENT)
      assert.equal(studentUserInfos.status, StudentUserStatus.ACCOUNT_CREATED)
    }
  })
  test('Check Student User Data', async ({ assert }) => {
    const studentUserInfos = await User.find(fakeStudent.userId)
    if (studentUserInfos) {
      assert.deepEqual(
        studentUserInfos.privacy_acceptation,
        DateTime.fromSQL('2024-08-24 11:48:12')
      )
    }
  })
  test('Check Student User Data', async ({ assert }) => {
    const studentUserInfos = await User.find(fakeStudent.userId)
    if (studentUserInfos) {
      assert.deepEqual(studentUserInfos.cgv_acceptation, DateTime.fromSQL('2024-08-24 11:48:12'))
    }
  })
  test('Get all professions with logged simple user role with is_valid_email = 0', async ({
    client,
  }) => {
    await fakeStudent.loginFakeStudent()
    const response = await client.get('/professions').header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(401)
  })
  test('Validate Student Email with wrong token', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .get('/validate-email/123456789/' + fakeStudent.email)
      .expect(401)

    assert.exists(body)
  })
  test('Validate Student Email with a good token', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .get(
        '/validate-email/' +
          fakeStudent.createdUser.email_validation_token +
          '/' +
          fakeStudent.email
      )
      .expect(200)

    assert.exists(body)
  })
  test('Get all professions with logged simple user role with is_valid_email = 1', async ({
    client,
  }) => {
    const response = await client.get('/professions').header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
  })
})
