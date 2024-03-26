// ADONIS
import { test } from '@japa/runner'
import supertest from 'supertest'
// HELPERS
import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import { FakeUserForTest } from './helpers/Auth.helper'
import { hardDeleteProfession, hardDeleteService, deleteFile } from './Utils.helper'
// ENUMS
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
// MODELS
import StudentProfilesHasProfessions from '@Models/StudentProfilesHasProfessions'

const BASE_URL = `${process.env.TEST_API_URL}`
const TESTS_FILES_PATH = './tests/functional/files_for_tests/'
const image1Path = TESTS_FILES_PATH + 'red_img_test_100x100.jpg'
const image2Path = TESTS_FILES_PATH + 'orange_img_test_100x100.jpg'
const image3Path = TESTS_FILES_PATH + 'green_img_test_100x100.jpg'
const documentPath = TESTS_FILES_PATH + 'student_good_achievement.pdf'
const mediaPath = TESTS_FILES_PATH + 'good_video.mp4'

const tooBigImagePath = TESTS_FILES_PATH + 'student_big_photo.jpg'
const wrongExtensionImagePath = TESTS_FILES_PATH + 'student_wrong_photo.gif'
const tooBigDocumentPath = TESTS_FILES_PATH + 'student_big_certificate.pdf'
const wrongExtensionDocumentPath = TESTS_FILES_PATH + 'student_wrong_certificate.xlsx'
const tooBigMediaPath = TESTS_FILES_PATH + 'too_big_video.mp4'
const wrongExtensionMediaPath = TESTS_FILES_PATH + 'student_wrong_proof.docx'

test.group('Achievements Management', (group) => {
  let fakeStudent = new FakeStudentForTest()
  let secondFakeStudent = new FakeStudentForTest('arya.stark@winterfell.com')
  let fakeClient = new FakeClientForTest()
  let fakeUser = new FakeUserForTest()
  let firstProfessionId: number
  let secondProfessionId: number
  let firstServiceOfFirstProfessionId: number
  let secondServiceOfFirstProfessionId: number
  let firstServiceOfSecondProfessionId: number
  let secondServiceOfSecondProfessionId: number
  let firstAchievementMainFile: string
  let firstAchievementDetailFile: string
  let secondAchievementDetailFile: string
  let thirdAchievementDetailFile: string
  let fourthAchievementDetailFile: string

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
    await hardDeleteService(firstServiceOfFirstProfessionId)
    await hardDeleteService(secondServiceOfFirstProfessionId)
    await hardDeleteService(firstServiceOfSecondProfessionId)
    await hardDeleteService(secondServiceOfSecondProfessionId)
    await deleteFile(firstAchievementMainFile)
    await deleteFile(firstAchievementDetailFile)
    await deleteFile(secondAchievementDetailFile)
    await deleteFile(thirdAchievementDetailFile)
    await deleteFile(fourthAchievementDetailFile)
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
        short_name: 'Graphisme Site web',
        is_enabled: true,
      })

    response.assertStatus(201)
    secondServiceOfFirstProfessionId = response.body().id
  })

  test('Create a first service in second profession with valid data with admin role', async ({
    client,
  }) => {
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

  test('Create a second service in second profession with valid data with admin role', async ({
    client,
  }) => {
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

  test('Add Professions to Student Profile by the student himself', async ({ client }) => {
    const response = await client
      .post('/add-professions-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        choosen_professions: [firstProfessionId, secondProfessionId],
      })
    response.assertStatus(200)

    await StudentProfilesHasProfessions.query()
      .where('student_profile_id', fakeStudent.studentProfileId)
      .where('profession_id', firstProfessionId)
      .update({ profession_has_been_accepted: true })

    await StudentProfilesHasProfessions.query()
      .where('student_profile_id', fakeStudent.studentProfileId)
      .where('profession_id', secondProfessionId)
      .update({ profession_has_been_accepted: true })
  })

  test('Add Achievement to Student Profile by the student himself with missing title', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })
  test('Add Achievement to Student Profile by the student himself with title too short', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: 'abcd',
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })
  test('Add Achievement to Student Profile by the student himself with title too long', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student himself with missing service id', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student with too big main file', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', tooBigImagePath)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student with wrong extension main file', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', wrongExtensionImagePath)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student with too big document file', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', tooBigDocumentPath)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student with wrong extension document file', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', wrongExtensionDocumentPath)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student with too big media file', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', tooBigMediaPath)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by the student with wrong extension media file', async ({
    client,
  }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', wrongExtensionMediaPath)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(422)
  })

  test('Add Achievement to Student Profile by a client', async ({ client }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeClient.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(401)
  })

  test('Add Achievement to Student Profile by an other student', async ({ client }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', secondFakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(401)
  })

  test('Add Achievement to Student Profile by the student himself', async ({ client }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .file('achievement_details', documentPath)
      .file('achievement_details', mediaPath)
      .fields({
        service_id: firstServiceOfFirstProfessionId,
        title: "Projet de fin d'études",
        description: 'Projet fictif de planète à conquérir',
        context: "J'ai réalisé un projet de fin d'études en tant que graphiste",
        date: '2020-11-15',
        is_favorite: true,
      })
    response.assertStatus(200)
    firstAchievementMainFile = response.body().achievement.main_image_file
    firstAchievementDetailFile = response.body().details[0].file
    secondAchievementDetailFile = response.body().details[1].file
    thirdAchievementDetailFile = response.body().details[2].file
    fourthAchievementDetailFile = response.body().details[3].file
  })
})
