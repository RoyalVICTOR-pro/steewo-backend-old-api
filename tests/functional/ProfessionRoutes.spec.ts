import { test } from '@japa/runner'
// import supertest from 'supertest'
import { FakeUserForTest } from './Auth.helper'
import { hardDeleteProfession } from './Utils.helper'

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
      .bearerToken(fakeUser.token)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({ name: 'Profession Test 1', is_enabled: true })
    response.assertStatus(401)
  })

  test('Create a first profession with missing name with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .bearerToken(fakeUser.adminToken)
      .field('name', '')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a first profession with valid data with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto1Path)
      .file('image_file', image1Path)
      .fields({ name: 'Profession Test 1', is_enabled: true })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'Profession Test 1',
      picto_file: './professions/pictos/profession-test-1.jpg',
    })
    firstProfessionId = response.body().id
  })

  test('Create a second profession with already used name with admin role', async ({ client }) => {
    const response = await client
      .post('/professions')
      .bearerToken(fakeUser.adminToken)
      .field('name', 'Profession Test 1')
      .field('is_enabled', true)
    response.assertStatus(422)
  })

  test('Create a second profession with valid data with admin role', async ({ assert, client }) => {
    const response = await client
      .post('/professions')
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto2Path)
      .file('image_file', image2Path)
      .fields({ name: 'Profession Test 2', is_enabled: true })
    response.assertStatus(201)

    secondProfessionId = response.body().id
    assert.equal(response.body().name, 'Profession Test 2')
    assert.equal(response.body().image_file, './professions/images/profession-test-2.jpg')
  })

  test('Get all professions with logged simple user role', async ({ assert, client }) => {
    const response = await client.get('/professions').bearerToken(fakeUser.token)
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
      .bearerToken(fakeUser.adminToken)
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
      .bearerToken(fakeUser.adminToken)
      .file('picto_file', picto3Path)
      .file('image_file', image3Path)
      .fields({ name: 'Profession Test 3', is_enabled: false })
    response.assertStatus(200)

    assert.equal(response.body().id, secondProfessionId)
    assert.equal(response.body().name, 'Profession Test 3')
    assert.equal(response.body().image_file, './professions/images/profession-test-3.jpg')
  })

  test('Get profession 2 by ID with logged simple user role', async ({ assert, client }) => {
    const response = await client
      .get('/professions/' + secondProfessionId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(200)

    assert.containsSubset(response.body(), {
      id: secondProfessionId,
      name: 'Profession Test 3',
      is_enabled: 1,
    })
  })

  test('Delete profession 1 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('/professions/' + firstProfessionId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteProfession(firstProfessionId)
  })
  test('Delete profession 2 by ID with admin role', async ({ client }) => {
    const response = await client
      .delete('/professions/' + secondProfessionId)
      .bearerToken(fakeUser.adminToken)
    response.assertStatus(204)
    hardDeleteProfession(secondProfessionId)
  })
})
