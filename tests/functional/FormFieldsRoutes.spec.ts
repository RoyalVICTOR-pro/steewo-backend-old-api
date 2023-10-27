import { test } from '@japa/runner'
// import supertest from 'supertest'
import { FakeUserForTest } from './Auth.helper'
import { hardDeleteProfession, hardDeleteService, hardDeleteFormField } from './Utils.helper'

// const BASE_URL = `${process.env.API_URL}`
const picto1Path = './tests/functional/files_for_tests/red_img_test_50x50.jpg'
const image1Path = './tests/functional/files_for_tests/red_img_test_100x100.jpg'
const tooltipImage1Path = './tests/functional/files_for_tests/orange_img_test_100x100.jpg'
const tooltipImage2Path = './tests/functional/files_for_tests/green_img_test_100x100.jpg'

let professionIdForTest: number
let serviceIdForTest: number
let firstFormFieldId: number
let secondFormFieldId: number
let thirdFormFieldId: number
let fourthFormFieldId: number

test.group("Service's Form Fields Management Routes Testing", (group) => {
  let fakeUser = new FakeUserForTest()

  group.setup(async () => {
    await fakeUser.registerAndLoginFakeUser()
    await fakeUser.loginAdminUser()
  })

  // TESTS UTILS
  test('Create a profession for tests', async ({ client }) => {
    const response = await client
      .post('/professions')
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({ name_fr: 'Profession Test 1', is_enabled: true })

    response.assertStatus(201)
    response.assertBodyContains({
      name_fr: 'Profession Test 1',
      picto_file: './professions/pictos/profession-test-1.jpg',
    })
    professionIdForTest = response.body().id
  })

  test('Create a service for tests', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({
        name_fr: 'Service Test 1',
        short_name_fr: 'Test 1',
        is_enabled: true,
      })

    response.assertStatus(201)
    response.assertBodyContains({
      name_fr: 'Service Test 1',
      short_name_fr: 'Test 1',
      picto_file: './services/pictos/service-test-1.jpg',
    })
    serviceIdForTest = response.body().id
  })

  // TESTS FOR FORM FIELDS
  test('Create a form field with valid data with simple user role : should fail', async ({
    client,
  }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.token)
      .file('tooltip_image_file', tooltipImage1Path)
      .fields({
        type: 'textarea',
        label: 'Objectifs',
        mandatory: true,
        tooltip_text: 'Test 1',
        description: 'Décrivez vos objectifs en quelques mots',
        placeholder: 'Ici vos objectifs',
      })
    response.assertStatus(401)
  })

  test('Create a first form field with missing data with admin role', async ({ client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.adminToken)
      .fields({
        label: 'Objectifs',
        tooltip_text: 'Test 1',
        description: 'Décrivez vos objectifs en quelques mots',
      })
    response.assertStatus(422)
  })

  test('Create a first form field with valid data with admin role', async ({ client, assert }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.adminToken)
      .file('tooltip_image_file', tooltipImage1Path)
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
      mandatory: 1,
    })
    assert.match(response.body().tooltip_image_file, /objectifs/)
    assert.equal(response.body().order, 1)
    firstFormFieldId = response.body().id
  })

  test('Create a second form field with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.adminToken)
      .fields({
        type: 'text',
        label: 'Nom de la marque',
        tooltip_text: 'Même si elle est en création',
        placeholder: 'Saisissez ici',
      })
    response.assertStatus(201)

    assert.equal(response.body().label, 'Nom de la marque')
    assert.equal(response.body().mandatory, 0)
    assert.equal(response.body().tooltip_image_file, '')
    assert.equal(response.body().order, 2)

    secondFormFieldId = response.body().id
  })
  test('Create a third form field with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.adminToken)
      .fields({
        type: 'text',
        label: 'Label Test 3',
      })
    response.assertStatus(201)

    assert.equal(response.body().order, 3)

    thirdFormFieldId = response.body().id
  })

  test('Create a fourth form field with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.adminToken)
      .fields({
        type: 'text',
        label: 'Label Test 4',
      })
    response.assertStatus(201)

    assert.equal(response.body().order, 4)

    fourthFormFieldId = response.body().id
  })

  test('Get all form fields for a service with logged simple user role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.token)
    response.assertStatus(200)

    assert.isTrue(
      response
        .body()
        .some((formField) => formField.id === firstFormFieldId && formField.label === 'Objectifs')
    )
    assert.isTrue(
      response
        .body()
        .some(
          (formField) =>
            formField.id === secondFormFieldId && formField.label === 'Nom de la marque'
        )
    )
  })

  test('Update the second form field with valid data with admin role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .put('services/' + serviceIdForTest + '/form-fields/' + secondFormFieldId)
      .bearerToken(fakeUser.adminToken)
      .file('tooltip_image_file', tooltipImage2Path)
      .fields({
        type: 'link',
        label: 'Site web',
        mandatory: true,
        tooltip_text: '',
        description: 'Donnez ici le lien vers votre site web personnel',
      })
    response.assertStatus(200)

    assert.equal(response.body().id, secondFormFieldId)
    assert.equal(response.body().label, 'Site web')
    assert.equal(response.body().mandatory, 1)
    assert.equal(response.body().placeholder, 'Saisissez ici')
  })

  test('Get form field 2 by ID with logged simple user role', async ({ assert, client }) => {
    const response = await client
      .get('services/' + serviceIdForTest + '/form-fields/' + secondFormFieldId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondFormFieldId,
      type: 'link',
      label: 'Site web',
      mandatory: 1,
      tooltip_text: '',
      description: 'Donnez ici le lien vers votre site web personnel',
    })
  })

  test('Update the form fields order with valid data with admin role', async ({
    assert,
    client,
  }) => {
    const reorderedFormFields: {
      id: number
      order: number
    }[] = [
      {
        id: firstFormFieldId,
        order: 1,
      },
      {
        id: secondFormFieldId,
        order: 4,
      },
      {
        id: thirdFormFieldId,
        order: 3,
      },
      {
        id: fourthFormFieldId,
        order: 2,
      },
    ]

    const response = await client
      .patch('services/' + serviceIdForTest + '/form-fields/order')
      .bearerToken(fakeUser.adminToken)
      .field('formFields', JSON.stringify(reorderedFormFields))
    response.assertStatus(200)
  })

  test('Get all form fields for a service with logged simple user role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('services/' + serviceIdForTest + '/form-fields')
      .bearerToken(fakeUser.token)
    response.assertStatus(200)

    assert.isTrue(
      response
        .body()
        .some((formField) => formField.id === secondFormFieldId && formField.order === 4)
    )
    assert.isTrue(
      response
        .body()
        .some((formField) => formField.id === fourthFormFieldId && formField.order === 2)
    )
  })

  test('Delete form field 1 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + firstFormFieldId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteFormField(firstFormFieldId)
  })
  test('Delete form field 2 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + secondFormFieldId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteFormField(secondFormFieldId)
  })
  test('Delete form field 3 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + thirdFormFieldId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteFormField(thirdFormFieldId)
  })
  test('Delete form field 4 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('services/' + serviceIdForTest + '/form-fields/' + fourthFormFieldId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteFormField(fourthFormFieldId)
  })

  group.teardown(async () => {
    await fakeUser.deleteFakeUser()
    await hardDeleteProfession(professionIdForTest)
    await hardDeleteService(serviceIdForTest)
  })
})
