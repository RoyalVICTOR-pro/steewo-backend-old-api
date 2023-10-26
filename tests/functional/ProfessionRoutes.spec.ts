import { test } from '@japa/runner'
import supertest from 'supertest'
import { FakeUserForTest } from './Auth.helper'
import fs from 'fs'

const BASE_URL = `${process.env.API_URL}`
const picto1 = fs.readFileSync('./tests/functional/files_for_tests/red_img_test_50x50.jpg')
const image1 = fs.readFileSync('./tests/functional/files_for_tests/red_img_test_100x100.jpg')
const picto2 = fs.readFileSync('./tests/functional/files_for_tests/orange_img_test_50x50.jpg')
const image2 = fs.readFileSync('./tests/functional/files_for_tests/orange_img_test_100x100.jpg')
const picto3 = fs.readFileSync('./tests/functional/files_for_tests/green_img_test_50x50.jpg')
const image3 = fs.readFileSync('./tests/functional/files_for_tests/green_img_test_100x100.jpg')
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

  test('Create a first profession with valid data but simple user role : should fail', async () => {
    await supertest(BASE_URL)
      .post('/professions')
      .set('Authorization', `Bearer ${fakeUser.token}`)
      .field('name_fr', 'Profession Test 1')
      .field('is_enabled', true)
      // .attach('picto_file', picto1)
      // .attach('image_file', image1)
      .expect(401)
  })

  test('Create a first profession with missing name with admin role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/professions')
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .field('name_fr', '')
      .field('is_enabled', true)
      .expect(422)
  })

  test('Create a first profession with valid data with admin role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/professions')
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .field('name_fr', 'Profession Test 1')
      .field('is_enabled', true)
      // .attach('picto_file', picto1)
      // .attach('image_file', image1)
      .expect(201)
    firstProfessionId = body.id
    assert.equal(body.name_fr, 'Profession Test 1')
    // assert.equal(body.picto_file, './professions/pictos/profession-test-1.jpg')
  })

  test('Create a second profession with already used name with admin role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/professions')
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .field('name_fr', 'Profession Test 1')
      .field('is_enabled', true)
      .expect(422)
  })

  test('Create a second profession with valid data with admin role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .post('/professions')
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .field('name_fr', 'Profession Test 2')
      .field('is_enabled', true)
      // .attach('picto_file', picto2)
      // .attach('image_file', image2)
      .expect(201)

    secondProfessionId = body.id
    assert.equal(body.name_fr, 'Profession Test 2')
    // assert.equal(body.image_file, './professions/images/profession-test-2.jpg')
  })

  test('Get all professions with logged simple user role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .get('/professions')
      .set('Authorization', `Bearer ${fakeUser.token}`)
      .expect(200)

    assert.isTrue(
      body.some(
        (profession) =>
          profession.id === firstProfessionId && profession.name_fr === 'Profession Test 1'
      )
    )
    assert.isTrue(
      body.some(
        (profession) =>
          profession.id === secondProfessionId && profession.name_fr === 'Profession Test 2'
      )
    )
  })

  test('Update a second profession with already used name with admin role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .put('/professions/' + secondProfessionId)
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .field('name_fr', 'Profession Test 1')
      .field('is_enabled', true)
      .expect(422)

    // assert.containsSubset(body, {
    //   rule: 'unique',
    // })
  })

  test('Update the second profession with valid data with admin role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .put('/professions/' + secondProfessionId)
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .field('name_fr', 'Profession Test 3')
      .field('is_enabled', false)
      // .attach('picto_file', picto3)
      // .attach('image_file', image3)
      .expect(200)

    assert.equal(body.id, secondProfessionId)
    assert.equal(body.name_fr, 'Profession Test 3')
    // assert.equal(body.image_file, './professions/images/profession-test-3.jpg')
  })

  test('Get profession 2 by ID with logged simple user role', async ({ assert }) => {
    const { body } = await supertest(BASE_URL)
      .get('/professions/' + secondProfessionId)
      .set('Authorization', `Bearer ${fakeUser.token}`)
      .expect(200)

    assert.containsSubset(body, {
      id: secondProfessionId,
      name_fr: 'Profession Test 3',
      is_enabled: 1,
    })
  })

  test('Delete profession 1 by ID with admin role', async () => {
    await supertest(BASE_URL)
      .delete('/professions/' + firstProfessionId)
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .expect(204)
  })
  test('Delete profession 2 by ID with admin role', async () => {
    await supertest(BASE_URL)
      .delete('/professions/' + secondProfessionId)
      .set('Authorization', `Bearer ${fakeUser.adminToken}`)
      .expect(204)
  })
})
