import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import { test } from '@japa/runner'
import supertest from 'supertest'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
import { FakeUserForTest } from './helpers/Auth.helper'
import { hardDeleteProfession, hardDeleteService } from './Utils.helper'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group('Student Profile Completion Process', (group) => {
  let fakeStudent = new FakeStudentForTest()
  let secondFakeStudent = new FakeStudentForTest('arya.stark@winterfell.com')
  let fakeClient = new FakeClientForTest()
  let fakeUser = new FakeUserForTest()
  let firstProfessionId: number
  let secondProfessionId: number
  let thirdProfessionId: number
  let firstServiceOfFirstProfessionId: number
  let secondServiceOfFirstProfessionId: number
  let thirdServiceOfFirstProfessionId: number
  let firstServiceOfSecondProfessionId: number
  let secondServiceOfSecondProfessionId: number

  group.setup(async () => {
    await fakeClient.registerFakeClient()
    await fakeClient.validateClientEmail()
    await fakeClient.loginFakeClient()
    await fakeStudent.createFakeStudentUserAccount()
    await fakeStudent.validateStudentEmail()
    await fakeStudent.loginFakeStudent()
    await secondFakeStudent.createFakeStudentUserAccount()
    await secondFakeStudent.validateStudentEmail()
    await secondFakeStudent.loginFakeStudent()
    await fakeUser.registerAndLoginFakeUser()
    await fakeUser.loginAdminUser()
  })

  group.teardown(async () => {
    await fakeStudent.deleteFakeStudent()
    await secondFakeStudent.deleteLinksWithProfessions()
    await secondFakeStudent.deleteLinksWithServices()
    await fakeStudent.deleteFakeStudent()
    await secondFakeStudent.deleteLinksWithProfessions()
    await secondFakeStudent.deleteLinksWithServices()
    await fakeClient.deleteFakeClient()
    await fakeUser.deleteFakeUser()
    await hardDeleteProfession(firstProfessionId)
    await hardDeleteProfession(secondProfessionId)
    await hardDeleteProfession(thirdProfessionId)
    await hardDeleteService(firstServiceOfFirstProfessionId)
    await hardDeleteService(secondServiceOfFirstProfessionId)
    await hardDeleteService(thirdServiceOfFirstProfessionId)
    await hardDeleteService(firstServiceOfSecondProfessionId)
    await hardDeleteService(secondServiceOfSecondProfessionId)
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

  // Add Professions
  test('Create a first profession with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({ name: 'Graphiste', is_enabled: true })

    response.assertStatus(201)
    firstProfessionId = response.body().id
  })

  test('Create a second profession with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({ name: 'Développeur', is_enabled: true })

    response.assertStatus(201)
    secondProfessionId = response.body().id
  })

  test('Create a third profession with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({ name: 'Photographe', is_enabled: false })

    response.assertStatus(201)
    thirdProfessionId = response.body().id
  })

  // Add Services to Professions

  test('Create a first service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + firstProfessionId + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: 'Création de logo',
        short_name: 'Logo',
        is_enabled: true,
      })

    response.assertStatus(201)
    firstServiceOfFirstProfessionId = response.body().id
  })

  test('Create a second service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + firstProfessionId + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: 'Création graphique de site internet',
        short_name: 'Site web',
        is_enabled: true,
      })

    response.assertStatus(201)
    secondServiceOfFirstProfessionId = response.body().id
  })

  test('Create a third service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + firstProfessionId + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: 'Création graphique de flyer',
        short_name: 'Flyer',
        is_enabled: true,
      })

    response.assertStatus(201)
    thirdServiceOfFirstProfessionId = response.body().id
  })

  test('Create a first service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + secondProfessionId + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: 'Développement de site web',
        short_name: 'Site web',
        is_enabled: true,
      })

    response.assertStatus(201)
    firstServiceOfSecondProfessionId = response.body().id
  })

  test('Create a second service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + secondProfessionId + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: "Développement d'application mobile",
        short_name: 'App mobile',
        is_enabled: true,
      })

    response.assertStatus(201)
    secondServiceOfSecondProfessionId = response.body().id
  })

  test('Add Professions to Student Profile by a client', async ({ client }) => {
    const response = await client
      .post('/add-professions-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        professions: [firstProfessionId, secondProfessionId],
      })
    response.assertStatus(401)
  })

  test('Add Professions to Student Profile by an other student', async ({ client }) => {
    const response = await client
      .post('/add-professions-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', secondFakeStudent.tokenCookie)
      .fields({
        professions: [firstProfessionId, secondProfessionId],
      })
    response.assertStatus(401)
  })

  test('Add Professions to Student Profile by the student himself', async ({ client }) => {
    const response = await client
      .post('/add-professions-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        professions: [firstProfessionId, secondProfessionId],
      })
    response.assertStatus(200)
  })

  test('Get Student Public Professions', async ({ client }) => {
    const response = await client
      .get('/get-student-public-professions/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
    console.log('response.body() :>> ', response.body())
    response.assertBodyContains([{ name: 'Graphiste' }, { name: 'Développeur' }])
  })
  // Add Professions to Student Profile Test
})
