import { test } from '@japa/runner'
// import supertest from 'supertest'
import { FakeUserForTest } from './Auth.helper'
import { hardDeleteProfession, hardDeleteService } from './Utils.helper'

// const BASE_URL = `${process.env.API_URL}`
const picto1Path = './tests/functional/files_for_tests/red_img_test_50x50.jpg'
const image1Path = './tests/functional/files_for_tests/red_img_test_100x100.jpg'
const picto2Path = './tests/functional/files_for_tests/orange_img_test_50x50.jpg'
const image2Path = './tests/functional/files_for_tests/orange_img_test_100x100.jpg'
const picto3Path = './tests/functional/files_for_tests/green_img_test_50x50.jpg'
const image3Path = './tests/functional/files_for_tests/green_img_test_100x100.jpg'
let professionIdForTest: number
let firstServiceId: number
let secondServiceId: number

test.group('Services Management Routes Testing', (group) => {
  let fakeUser = new FakeUserForTest()

  group.setup(async () => {
    await fakeUser.registerAndLoginFakeUser()
    await fakeUser.loginAdminUser()
  })

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

  test('Create a service with valid data with simple user role : should fail', async ({
    client,
  }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .bearerToken(fakeUser.token)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({
        name_fr: 'Service Test 1',
        short_name_fr: 'Test 1',
        is_enabled: true,
      })
    response.assertStatus(401)
  })

  test('Create a first service with missing data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .bearerToken(fakeUser.adminToken)
      .field('name_fr', '')
      .field('short_name_fr', '')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a first service with valid data with admin role', async ({ client }) => {
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
    firstServiceId = response.body().id
  })

  test('Create a second service with already used name with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .bearerToken(fakeUser.adminToken)
      .field('name_fr', 'Service Test 1')
      .field('short_name_fr', 'Test 11')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a second service with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto2Path)
      .file('image_file', image2Path)
      .fields({
        name_fr: 'Service Test 2',
        short_name_fr: 'Test 2',
        is_enabled: false,
      })
    response.assertStatus(201)

    secondServiceId = response.body().id
    assert.equal(response.body().name_fr, 'Service Test 2')
    assert.equal(response.body().short_name_fr, 'Test 2')
    assert.equal(response.body().image_file, './services/images/service-test-2.jpg')
  })

  test('Get all services for a profession with logged simple user role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('professions/' + professionIdForTest + '/services')
      .bearerToken(fakeUser.token)
    response.assertStatus(200)

    assert.isTrue(
      response
        .body()
        .some((service) => service.id === firstServiceId && service.name_fr === 'Service Test 1')
    )
    assert.isTrue(
      response
        .body()
        .some((service) => service.id === secondServiceId && service.name_fr === 'Service Test 2')
    )
  })

  test('Update a second service with already used name with admin role', async ({ client }) => {
    const response = await client
      .put('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .bearerToken(fakeUser.adminToken)
      .field('name_fr', 'Service Test 1')
      .field('short_name_fr', 'Test 1')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Update the second service with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .put('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto3Path)
      .file('image_file', image3Path)
      .fields({
        name_fr: 'Service Test 3',
        short_name_fr: 'Test 3',
        is_enabled: false,
      })
    response.assertStatus(200)

    assert.equal(response.body().id, secondServiceId)
    assert.equal(response.body().name_fr, 'Service Test 3')
    assert.equal(response.body().short_name_fr, 'Test 3')
    assert.equal(response.body().image_file, './services/images/service-test-3.jpg')
  })

  test('Get service 2 by ID with logged simple user role', async ({ assert, client }) => {
    const response = await client
      .get('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondServiceId,
      name_fr: 'Service Test 3',
      short_name_fr: 'Test 3',
      is_enabled: 0,
    })
  })

  test('Delete service 1 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('professions/' + professionIdForTest + '/services/' + firstServiceId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteService(firstServiceId)
  })
  test('Delete service 2 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteService(secondServiceId)
  })

  group.teardown(async () => {
    await fakeUser.deleteFakeUser()
    await hardDeleteProfession(professionIdForTest)
  })
})
