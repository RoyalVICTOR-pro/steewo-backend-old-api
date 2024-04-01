// ADONIS
import { test } from '@japa/runner'
import supertest from 'supertest'
// HELPERS
import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import { FakeUserForTest } from './helpers/Auth.helper'
import { hardDeleteProfession, hardDeleteService } from './Utils.helper'
// ENUMS
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
// MODELS
import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'
import StudentProfilesHasServices from '@Models/StudentProfilesHasServices'

const BASE_URL = `${process.env.TEST_API_URL}`

test.group(
  'Student Profile Validation Process (Complete and with just a new profession)',
  (group) => {
    let fakeStudent = new FakeStudentForTest()
    let secondFakeStudent = new FakeStudentForTest('arya.stark@winterfell.com')
    let fakeClient = new FakeClientForTest()
    let fakeUser = new FakeUserForTest()
    let firstProfessionId: number
    let secondProfessionId: number
    let thirdProfessionId: number
    let fourthProfessionId: number
    let firstServiceOfFirstProfessionId: number
    let secondServiceOfFirstProfessionId: number
    let thirdServiceOfFirstProfessionId: number
    let firstServiceOfSecondProfessionId: number
    let secondServiceOfSecondProfessionId: number
    let firstServiceOfThirdProfessionId: number
    let secondServiceOfThirdProfessionId: number
    let firstServiceOfFourthProfessionId: number
    let secondServiceOfFourthProfessionId: number

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
      await fakeStudent.deleteLinksWithProfessions()
      await fakeStudent.deleteLinksWithServices()
      await secondFakeStudent.deleteFakeStudent()
      await fakeClient.deleteFakeClient()
      await fakeUser.deleteFakeUser()
      await hardDeleteProfession(firstProfessionId)
      await hardDeleteProfession(secondProfessionId)
      await hardDeleteProfession(thirdProfessionId)
      await hardDeleteProfession(fourthProfessionId)
      await hardDeleteService(firstServiceOfFirstProfessionId)
      await hardDeleteService(secondServiceOfFirstProfessionId)
      await hardDeleteService(thirdServiceOfFirstProfessionId)
      await hardDeleteService(firstServiceOfSecondProfessionId)
      await hardDeleteService(secondServiceOfSecondProfessionId)
      await hardDeleteService(firstServiceOfThirdProfessionId)
      await hardDeleteService(secondServiceOfThirdProfessionId)
      await hardDeleteService(firstServiceOfFourthProfessionId)
      await hardDeleteService(secondServiceOfFourthProfessionId)
      await StudentProfilesHasProfessions.query()
        .where('student_profile_id', fakeStudent.studentProfileId)
        .delete()
      await StudentProfilesHasServices.query()
        .where('student_profile_id', fakeStudent.studentProfileId)
        .delete()
    })

    test('Register student with valid data', async ({ assert }) => {
      const { body } = await supertest(BASE_URL)
        .post('/student/register')
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
        .fields({ name: 'Photographe', is_enabled: true })

      response.assertStatus(201)
      thirdProfessionId = response.body().id
    })

    test('Create a fourth profession with valid data with admin role', async ({ client }) => {
      const response = await client
        .post('/professions')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({ name: 'Vidéaste', is_enabled: true })

      response.assertStatus(201)
      fourthProfessionId = response.body().id
    })

    // Add Services to Professions

    test('Create a first service for the first profession', async ({ client }) => {
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

    test('Create a second service for the first profession', async ({ client }) => {
      const response = await client
        .post('professions/' + firstProfessionId + '/services')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({
          name: 'Création graphique de site internet',
          short_name: 'Graphisme Site web',
          is_enabled: true,
        })

      response.assertStatus(201)
      secondServiceOfFirstProfessionId = response.body().id
    })

    test('Create a third service for the first profession', async ({ client }) => {
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

    test('Create a first service for the second profession', async ({ client }) => {
      const response = await client
        .post('professions/' + secondProfessionId + '/services')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({
          name: 'Développement de site web',
          short_name: 'Dév Site web',
          is_enabled: true,
        })

      response.assertStatus(201)
      firstServiceOfSecondProfessionId = response.body().id
    })

    test('Create a second service for the second profession', async ({ client }) => {
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

    test('Create a first service for the third profession', async ({ client }) => {
      const response = await client
        .post('professions/' + thirdProfessionId + '/services')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({
          name: 'Photos de naissance',
          short_name: 'Naissance',
          is_enabled: true,
        })

      response.assertStatus(201)
      firstServiceOfThirdProfessionId = response.body().id
    })

    test('Create a second service for the third profession', async ({ client }) => {
      const response = await client
        .post('professions/' + thirdProfessionId + '/services')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({
          name: 'Photos de mariage',
          short_name: 'Mariage',
          is_enabled: true,
        })

      response.assertStatus(201)
      secondServiceOfThirdProfessionId = response.body().id
    })

    test('Create a first service for the fourth profession', async ({ client }) => {
      const response = await client
        .post('professions/' + fourthProfessionId + '/services')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({
          name: 'Vidéo de mariage',
          short_name: 'Vidéo Mariage',
          is_enabled: true,
        })

      response.assertStatus(201)
      firstServiceOfFourthProfessionId = response.body().id
    })

    test('Create a second service for the fourth profession', async ({ client }) => {
      const response = await client
        .post('professions/' + fourthProfessionId + '/services')
        .header('Cookie', fakeUser.adminTokenCookie)
        .fields({
          name: 'Vidéo de naissance',
          short_name: 'Vidéo Naissance',
          is_enabled: true,
        })

      response.assertStatus(201)
      secondServiceOfFourthProfessionId = response.body().id
    })

    test('Add Professions to Student Profile by the student himself', async ({ client }) => {
      const response = await client
        .post('/student/add-professions-to-profile/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeStudent.tokenCookie)
        .fields({
          choosen_professions: [firstProfessionId, secondProfessionId],
        })
      response.assertStatus(200)
    })

    test('Add Services to Student Profile by the student himself', async ({ client }) => {
      const response = await client
        .post('/student/add-services-to-profile/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeStudent.tokenCookie)
        .fields({
          choosen_services: [
            firstServiceOfFirstProfessionId,
            secondServiceOfFirstProfessionId,
            firstServiceOfSecondProfessionId,
          ],
        })
      response.assertStatus(200)
    })

    test('Get Student Public Professions before validation request', async ({ client }) => {
      const response = await client
        .get('/student/get-public-professions/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Get Student Public Services before validation request', async ({ client }) => {
      const response = await client
        .get('/student/get-public-services/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Check if there is any validation request before the request', async ({ client }) => {
      const response = await client
        .get('/student/get-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Ask for validation of the student profile', async ({ client }) => {
      const response = await client
        .patch('/student/ask-profile-validation/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeStudent.tokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is a validation request after the first validation request', async ({
      client,
    }) => {
      const response = await client
        .get('/student/get-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([{ user_id: fakeStudent.userId }])
    })

    test('Get Student Public Professions after validation request', async ({ client }) => {
      const response = await client
        .get('/student/get-public-professions/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Reject the validation request', async ({ client }) => {
      const response = await client
        .post('/student/reject-profile-validation/' + fakeStudent.studentProfileId)
        .field('comment', 'Ton profil ne correspond pas à nos critères.')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is a notification after the rejection', async ({ client }) => {
      const response = await client
        .get('/get-notifications-of-user/')
        .header('Cookie', fakeStudent.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([
        {
          content:
            "Ton profil a été refusé par l'équipe Steewo : Ton profil ne correspond pas à nos critères.",
        },
      ])
    })

    test('Check if there is no validation request after the rejection', async ({ client }) => {
      const response = await client
        .get('/student/get-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Ask for validation of the student profile after rejection', async ({ client }) => {
      const response = await client
        .patch('/student/ask-profile-validation/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeStudent.tokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is a validation request after the second request', async ({ client }) => {
      const response = await client
        .get('/student/get-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([{ user_id: fakeStudent.userId }])
    })

    test('Accept the validation request', async ({ client }) => {
      const response = await client
        .patch('/student/validate-profile/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is no validation request after the validation', async ({ client }) => {
      const response = await client
        .get('/student/get-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Get Student Public Professions after validation', async ({ client }) => {
      const response = await client
        .get('/student/get-public-professions/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([{ name: 'Graphiste' }, { name: 'Développeur' }])
    })

    test('Get Student Public Services after validation', async ({ client }) => {
      const response = await client
        .get('/student/get-public-services/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([
        { name: 'Création de logo' },
        { name: 'Création graphique de site internet' },
        { name: 'Développement de site web' },
      ])
    })

    test('Add Professions to Student Profile by the student himself', async ({ client }) => {
      const response = await client
        .post('/student/add-professions-to-profile/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeStudent.tokenCookie)
        .fields({
          choosen_professions: [thirdProfessionId, fourthProfessionId],
        })
      response.assertStatus(200)
    })

    test('Add Services to Student Profile by the student himself', async ({ client }) => {
      const response = await client
        .post('/student/add-services-to-profile/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeStudent.tokenCookie)
        .fields({
          choosen_services: [
            firstServiceOfThirdProfessionId,
            secondServiceOfThirdProfessionId,
            firstServiceOfFourthProfessionId,
          ],
        })
      response.assertStatus(200)
    })

    test('Get Student Public Professions after validation', async ({ client }) => {
      const response = await client
        .get('/student/get-public-professions/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([{ name: 'Graphiste' }, { name: 'Développeur' }])
    })

    test('Get Student Public Services after validation', async ({ client }) => {
      const response = await client
        .get('/student/get-public-services/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([
        { name: 'Création de logo' },
        { name: 'Création graphique de site internet' },
        { name: 'Développement de site web' },
      ])
    })

    test('Check if there is any validation request before the request', async ({ client }) => {
      const response = await client
        .get('/student/get-professions-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Ask for validation of the new profession', async ({ client }) => {
      const response = await client
        .patch(
          '/student/' +
            fakeStudent.studentProfileId +
            '/ask-new-profession-validation/' +
            thirdProfessionId
        )
        .header('Cookie', fakeStudent.tokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is a validation request after the new profession validation request', async ({
      client,
    }) => {
      const response = await client
        .get('/student/get-professions-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([{ student_profile_id: fakeStudent.studentProfileId }])
    })

    test('Reject the validation request', async ({ client }) => {
      const response = await client
        .post(
          '/student/' +
            fakeStudent.studentProfileId +
            '/reject-new-profession-validation/' +
            thirdProfessionId
        )
        .field('comment', 'Ton profil ne correspond pas à nos critères.')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is a notification after the rejection', async ({ client }) => {
      const response = await client
        .get('/get-notifications-of-user/')
        .header('Cookie', fakeStudent.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([
        {
          content:
            "Ton profil a été refusé par l'équipe Steewo : Ton profil ne correspond pas à nos critères.",
        },
      ])
    })

    test('Check if there is no validation request after the rejection', async ({ client }) => {
      const response = await client
        .get('/student/get-professions-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Ask for validation of the new profession after rejection', async ({ client }) => {
      const response = await client
        .patch(
          '/student/' +
            fakeStudent.studentProfileId +
            '/ask-new-profession-validation/' +
            thirdProfessionId
        )
        .header('Cookie', fakeStudent.tokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is a validation request after the second request for new profession', async ({
      client,
      assert,
    }) => {
      const response = await client
        .get('/student/get-professions-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      assert.containsSubset(response.body(), [{ student_profile_id: fakeStudent.studentProfileId }])
    })

    test('Accept the new profession validation request', async ({ client }) => {
      const response = await client
        .patch(
          '/student/' +
            fakeStudent.studentProfileId +
            '/validate-new-profession/' +
            thirdProfessionId
        )
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
    })

    test('Check if there is no validation request after the validation', async ({ client }) => {
      const response = await client
        .get('/student/get-professions-validation-requests/')
        .header('Cookie', fakeUser.adminTokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([])
    })

    test('Get Student Public Professions after validation', async ({ client }) => {
      const response = await client
        .get('/student/get-public-professions/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([
        { name: 'Graphiste' },
        { name: 'Développeur' },
        { name: 'Photographe' },
      ])
    })

    test('Get Student Public Services after validation', async ({ client }) => {
      const response = await client
        .get('/student/get-public-services/' + fakeStudent.studentProfileId)
        .header('Cookie', fakeClient.tokenCookie)
      response.assertStatus(200)
      response.assertBodyContains([
        { name: 'Création de logo' },
        { name: 'Création graphique de site internet' },
        { name: 'Développement de site web' },
        { name: 'Photos de naissance' },
        { name: 'Photos de mariage' },
      ])
    })
  }
)
