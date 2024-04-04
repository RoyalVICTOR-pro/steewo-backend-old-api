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
import { FakeUserForTest } from './helpers/Auth.helper'

// UTILS
import {
  hardDeleteProfession,
  hardDeleteService,
  hardDeleteFormField,
  hardDeleteMission,
} from './Utils.helper'
import AddServiceInfoToMissionDTO from 'App/DataAccessLayer/DTO/AddServiceInfoToMissionDTO'
const BASE_URL = `${process.env.TEST_API_URL}`
const TESTS_FILES_PATH = './tests/functional/files_for_tests/'
const clientPhotoPath1 = TESTS_FILES_PATH + 'red_img_test_100x100.jpg'
// const clientPhotoPath2 = TESTS_FILES_PATH + 'orange_img_test_200x200.jpg'

test.group('Mission Creation and Update Process', (group) => {
  let fakeUser = new FakeUserForTest()
  let fakeClient = new FakeClientForTest()
  let fakeStudent = new FakeStudentForTest()
  let professionIdForTest: number
  let serviceIdForTest: number
  let firstFormFieldId: number
  let secondFormFieldId: number
  let thirdFormFieldId: number
  let fourthFormFieldId: number
  let missionId: number

  group.setup(async () => {
    await fakeClient.registerFakeClient()

    await fakeStudent.createFakeStudentUserAccount()
    await fakeStudent.validateStudentEmail()
    await fakeStudent.loginFakeStudent()

    await fakeUser.registerAndLoginFakeUser()
    await fakeUser.loginAdminUser()
  })

  group.teardown(async () => {
    await fakeClient.deleteFakeClient()
    await fakeStudent.deleteFakeStudent()
    await fakeUser.deleteFakeUser()
    await hardDeleteProfession(professionIdForTest)
    await hardDeleteService(serviceIdForTest)
    // await hardDeleteMission(missionId)
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
    fakeClient.clientProfileId = body.id
    await fakeClient.validateClientEmail()
    await fakeClient.loginFakeClient()
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

  test('Create a profession for tests', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({ name: 'Profession Test 1', is_enabled: true })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Profession Test 1',
    })
    professionIdForTest = response.body().id
  })

  test('Create a service for tests', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: 'Service Test 1',
        short_name: 'Test 1',
        is_enabled: true,
      })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Service Test 1',
      short_name: 'Test 1',
    })
    serviceIdForTest = response.body().id
  })

  test('Create a first form field with valid data with admin role', async ({ client, assert }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        type: 'textarea',
        label: 'Objectifs',
        mandatory: true,
        tooltip_text: 'Test 1',
        description: 'Décrivez vos objectifs en quelques mots',
        placeholder: 'Ici vos objectifs',
      })

    response.assertStatus(201)
    response.assertBodyContains({
      label: 'Objectifs',
      mandatory: true,
    })
    assert.equal(response.body().order, 1)
    firstFormFieldId = response.body().id
  })

  test('Create a second form field with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        type: 'text',
        label: 'Nom de la marque',
        mandatory: false,
        tooltip_text: 'Même si elle est en création',
        placeholder: 'Saisissez ici',
      })
    response.assertStatus(201)

    assert.equal(response.body().label, 'Nom de la marque')
    assert.equal(response.body().mandatory, false)
    assert.equal(response.body().tooltip_image_file, null)
    assert.equal(response.body().order, 2)

    secondFormFieldId = response.body().id
  })
  test('Create a third form field with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        type: 'text',
        label: 'Label Test 3',
        mandatory: false,
      })
    response.assertStatus(201)

    assert.equal(response.body().order, 3)

    thirdFormFieldId = response.body().id
  })

  test('Create a fourth form field with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        type: 'text',
        label: 'Label Test 4',
        mandatory: false,
      })
    response.assertStatus(201)

    assert.equal(response.body().order, 4)

    fourthFormFieldId = response.body().id
  })

  test('Get all public professions with logged simple user role with is_valid_email = 1', async ({
    client,
  }) => {
    const response = await client
      .get('/public-professions')
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })

  // ###################################
  // MISSION CREATION
  // ###################################
  test('Create a mission with valid data with client role', async ({ client, assert }) => {
    const response = await client
      .post('/mission/create/' + fakeClient.clientProfileId)
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        name: 'Mission Test 1',
      })
    response.assertStatus(201)
    assert.equal(response.body().name, 'Mission Test 1')
    missionId = response.body().id
  })

  // test('Add a service to the mission with valid data with client role', async ({ client }) => {
  //   const serviceInfo1 = {
  //     service_form_field_id: firstFormFieldId,
  //     value: 'Objectif 1',
  //   }

  //   const serviceInfo2 = {
  //     service_form_field_id: secondFormFieldId,
  //     value: 'Nom de la marque 1',
  //   }

  //   const response = await client
  //     .post('/mission/' + missionId + '/add-service/' + fakeClient.clientProfileId)
  //     .header('Cookie', fakeClient.tokenCookie)
  //     .field('service_id', serviceIdForTest)
  //     .field('serviceInfos', [serviceInfo1, serviceInfo2])
  //   response.assertStatus(200)
  // })

  // ###################################
  // DELETE
  // ###################################
  test('Delete form field 1 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + firstFormFieldId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteFormField(firstFormFieldId)
  })
  test('Delete form field 2 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + secondFormFieldId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteFormField(secondFormFieldId)
  })
  test('Delete form field 3 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + thirdFormFieldId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteFormField(thirdFormFieldId)
  })
  test('Delete form field 4 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + fourthFormFieldId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteFormField(fourthFormFieldId)
  })
})
