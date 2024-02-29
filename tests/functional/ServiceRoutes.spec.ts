import { test } from '@japa/runner'
// import supertest from 'supertest'
import { FakeUserForTest } from './helpers/Auth.helper'
import { hardDeleteProfession, hardDeleteService } from './Utils.helper'
import Drive from '@ioc:Adonis/Core/Drive'

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
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({ name: 'Profession Test 1', is_enabled: true })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Profession Test 1',
      picto_file: 'professions/pictos/profession-test-1.jpg',
    })
    professionIdForTest = response.body().id
  })

  test('Create a service with valid data with simple user role : should fail', async ({
    client,
  }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.tokenCookie)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({
        name: 'Service Test 1',
        short_name: 'Test 1',
        is_enabled: true,
      })
    response.assertStatus(401)
  })

  test('Create a first service with missing data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', '')
      .field('short_name', '')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a first service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({
        name: 'Service Test 1',
        short_name: 'Test 1',
        is_enabled: true,
      })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Service Test 1',
      short_name: 'Test 1',
      picto_file: 'services/pictos/service-test-1.jpg',
    })
    firstServiceId = response.body().id
  })

  test('Create a second service with already used name with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', 'Service Test 1')
      .field('short_name', 'Test 11')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a second service with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto2Path)
      .file('image_file', image2Path)
      .fields({
        name: 'Service Test 2',
        short_name: 'Test 2',
        is_enabled: false,
      })
    response.assertStatus(201)

    secondServiceId = response.body().id
    assert.equal(response.body().name, 'Service Test 2')
    assert.equal(response.body().short_name, 'Test 2')
    assert.equal(response.body().image_file, 'services/images/service-test-2.jpg')
  })

  test('Get all services for a profession with logged simple user role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.isTrue(
      response
        .body()
        .some((service) => service.id === firstServiceId && service.name === 'Service Test 1')
    )
    assert.isTrue(
      response
        .body()
        .some((service) => service.id === secondServiceId && service.name === 'Service Test 2')
    )
  })

  test('Update a second service with already used name with admin role', async ({ client }) => {
    const response = await client
      .put('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', 'Service Test 1')
      .field('short_name', 'Test 1')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Update the second service with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .put('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto3Path)
      .file('image_file', image3Path)
      .fields({
        name: 'Service Test 3',
        short_name: 'Test 3',
        is_enabled: false,
      })
    response.assertStatus(200)

    assert.equal(response.body().id, secondServiceId)
    assert.equal(response.body().name, 'Service Test 3')
    assert.equal(response.body().short_name, 'Test 3')
    assert.equal(response.body().image_file, 'services/images/service-test-3.jpg')
    assert.equal(await Drive.exists('services/images/service-test-3.jpg'), true)
  })

  test('Get service 2 by ID with logged simple user role', async ({ assert, client }) => {
    const response = await client
      .get('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondServiceId,
      name: 'Service Test 3',
      short_name: 'Test 3',
      is_enabled: 0,
    })
  })

  test('Update the second service status with valid data with admin role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .patch('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        is_enabled: true,
      })
    response.assertStatus(200)

    assert.equal(response.body().id, secondServiceId)
    assert.equal(response.body().is_enabled, 1)
  })

  test('Get service 2 by ID with logged simple user role after status update', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondServiceId,
      name: 'Service Test 3',
      short_name: 'Test 3',
      is_enabled: 1,
    })
  })

  test('Delete service 1 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('professions/' + professionIdForTest + '/services/' + firstServiceId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteService(firstServiceId)
  })
  test('Delete service 2 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteService(secondServiceId)
  })
  test('Delete created profession by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('/professions/' + professionIdForTest)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteProfession(professionIdForTest)
  })
  test('Create a profession for casacade deleting tests', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({ name: 'Profession Test Cascade Deleting', is_enabled: true })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Profession Test Cascade Deleting',
      picto_file: 'professions/pictos/profession-test-cascade-deleting.jpg',
    })
    professionIdForTest = response.body().id
  })
  test('Create a first service with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({
        name: 'Service Test 1 Cascade',
        short_name: 'Test 1',
        is_enabled: true,
      })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Service Test 1 Cascade',
      short_name: 'Test 1',
      picto_file: 'services/pictos/service-test-1-cascade.jpg',
    })
    firstServiceId = response.body().id
  })
  test('Create a second service with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto2Path)
      .file('image_file', image2Path)
      .fields({
        name: 'Service Test 2 Cascade',
        short_name: 'Test 2',
        is_enabled: false,
      })
    response.assertStatus(201)

    secondServiceId = response.body().id
    assert.equal(response.body().name, 'Service Test 2 Cascade')
    assert.equal(response.body().short_name, 'Test 2')
    assert.equal(response.body().image_file, 'services/images/service-test-2-cascade.jpg')
  })

  test('Update the second service name for checking the renaming of the file', async ({
    client,
    assert,
  }) => {
    const response = await client
      .put('professions/' + professionIdForTest + '/services/' + secondServiceId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({
        name: 'Service Test 4',
        short_name: 'Test 4',
        is_enabled: false,
      })
    response.assertStatus(200)

    assert.equal(response.body().image_file, 'services/images/service-test-4.jpg')
    assert.equal(await Drive.exists('services/images/service-test-3.jpg'), false)
    assert.equal(await Drive.exists(response.body().image_file), true)
  })

  test('Delete Image of service 1 with admin role', async ({ client, assert }) => {
    const response = await client
      .patch('/services/' + firstServiceId + '/delete-image')
      .header('Cookie', fakeUser.adminTokenCookie)
    assert.equal(await Drive.exists('services/images/service-test-1.jpg'), false)
    response.assertStatus(204)
  })

  test('Delete profession created for cascading deleting tests by ID with admin role', async ({
    client,
  }) => {
    const response = await client
      .delete('/professions/' + professionIdForTest)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteProfession(professionIdForTest)
  })
  test('Get all services for a profession with logged simple user role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('professions/' + professionIdForTest + '/services')
      .header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.isFalse(
      response
        .body()
        .some(
          (service) => service.id === firstServiceId && service.name === 'Service Test 1 Cascade'
        )
    )
    assert.isFalse(
      response
        .body()
        .some(
          (service) => service.id === secondServiceId && service.name === 'Service Test 2 Cascade'
        )
    )
  })
  group.teardown(async () => {
    await fakeUser.deleteFakeUser()
    await hardDeleteProfession(professionIdForTest)
    await hardDeleteService(firstServiceId)
    await hardDeleteService(secondServiceId)
  })
})
