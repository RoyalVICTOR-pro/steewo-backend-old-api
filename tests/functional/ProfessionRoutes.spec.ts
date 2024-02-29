import { test } from '@japa/runner'
// import supertest from 'supertest'
import { FakeUserForTest } from './helpers/Auth.helper'
import { hardDeleteProfession } from './Utils.helper'
import Drive from '@ioc:Adonis/Core/Drive'

// const BASE_URL = `${process.env.API_URL}`
const picto1Path = './tests/functional/files_for_tests/red_img_test_50x50.jpg'
const image1Path = './tests/functional/files_for_tests/red_img_test_100x100.jpg'
const picto2Path = './tests/functional/files_for_tests/orange_img_test_50x50.jpg'
const image2Path = './tests/functional/files_for_tests/orange_img_test_100x100.jpg'
const picto3Path = './tests/functional/files_for_tests/green_img_test_50x50.jpg'
const image3Path = './tests/functional/files_for_tests/green_img_test_100x100.jpg'
let firstProfessionId: number
let secondProfessionId: number

test.group('ProfessionRoutes', (group) => {
  let fakeUser = new FakeUserForTest()

  group.setup(async () => {
    await fakeUser.registerAndLoginFakeUser()
    await fakeUser.loginAdminUser()
  })

  group.teardown(async () => {
    await fakeUser.deleteFakeUser()
  })

  test('Create a first profession with valid data but simple user role : should fail', async ({
    client,
  }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.tokenCookie)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({ name: 'Profession Test 1', is_enabled: true })
    response.assertStatus(401)
  })

  test('Create a first profession with missing name with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', '')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a first profession with valid data with admin role', async ({ client }) => {
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
    firstProfessionId = response.body().id
  })

  test('Create a second profession with already used name with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', 'Profession Test 1')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a second profession with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('/professions')
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto2Path)
      .file('image_file', image2Path)
      .fields({ name: 'Profession Test 2', is_enabled: true })
    response.assertStatus(201)

    secondProfessionId = response.body().id
    assert.equal(response.body().name, 'Profession Test 2')
    assert.equal(response.body().image_file, 'professions/images/profession-test-2.jpg')
  })

  test('Get all professions with logged simple user role with is_valid_email = 0', async ({
    client,
  }) => {
    const response = await client.get('/professions').header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(401)
  })
  test('Get all professions with logged simple user role with is_valid_email = 1', async ({
    assert,
    client,
  }) => {
    await fakeUser.validateUserEmail()
    const response = await client.get('/professions').header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.isTrue(
      response
        .body()
        .some(
          (profession) =>
            profession.id === firstProfessionId && profession.name === 'Profession Test 1'
        )
    )
    assert.isTrue(
      response
        .body()
        .some(
          (profession) =>
            profession.id === secondProfessionId && profession.name === 'Profession Test 2'
        )
    )
  })

  test('Update a second profession with already used name with admin role', async ({ client }) => {
    const response = await client
      .put('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', 'Profession Test 1')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Update the second profession with valid data with admin role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .put('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .file('picto_file', picto3Path)
      .file('image_file', image3Path)
      .fields({ name: 'Profession Test 3', is_enabled: false })
    response.assertStatus(200)

    assert.equal(response.body().id, secondProfessionId)
    assert.equal(response.body().name, 'Profession Test 3')
    assert.equal(response.body().image_file, 'professions/images/profession-test-3.jpg')
    assert.equal(await Drive.exists('professions/images/profession-test-3.jpg'), true)
  })

  test('Get profession 2 by ID with logged simple user role', async ({ assert, client }) => {
    const response = await client
      .get('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondProfessionId,
      name: 'Profession Test 3',
      is_enabled: 0,
    })
  })

  test('Update the second profession status with valid data with admin role', async ({
    assert,
    client,
  }) => {
    const response = await client
      .patch('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .fields({ is_enabled: true })
    response.assertStatus(200)

    assert.equal(response.body().id, secondProfessionId)
    assert.equal(response.body().is_enabled, 1)
  })

  test('Get profession 2 by ID with logged simple user role after status update', async ({
    assert,
    client,
  }) => {
    const response = await client
      .get('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.tokenCookie)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondProfessionId,
      name: 'Profession Test 3',
      is_enabled: 1,
    })
  })

  test('Update the second profession name for checking the renaming of the file', async ({
    client,
    assert,
  }) => {
    const response = await client
      .put('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.adminTokenCookie)
      .field('name', 'Profession Test 4')
      .field('is_enabled', true)
    response.assertStatus(200)
    assert.equal(response.body().image_file, 'professions/images/profession-test-4.jpg')
    assert.equal(await Drive.exists('professions/images/profession-test-3.jpg'), false)
    assert.equal(await Drive.exists(response.body().image_file), true)
  })

  test('Delete Image of profession 1 with admin role', async ({ client, assert }) => {
    const response = await client
      .patch('/professions/' + firstProfessionId + '/delete-image')
      .header('Cookie', fakeUser.adminTokenCookie)
    assert.equal(await Drive.exists('professions/images/profession-test-1.jpg'), false)
    response.assertStatus(204)
  })

  test('Delete profession 1 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('/professions/' + firstProfessionId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteProfession(firstProfessionId)
  })
  test('Delete profession 2 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('/professions/' + secondProfessionId)
      .header('Cookie', fakeUser.adminTokenCookie)
    response.assertStatus(204)
    hardDeleteProfession(secondProfessionId)
  })
})
