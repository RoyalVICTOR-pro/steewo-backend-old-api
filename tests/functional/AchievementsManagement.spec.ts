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
  let firstAchievementId: number
  let secondAchievementId: number
  let firstAchievementDetailId: number
  let secondAchievementDetailId: number
  let thirdAchievementDetailId: number
  let fourthAchievementDetailId: number

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

  test('Add Services to Student Profile by the student himself', async ({ client }) => {
    const response = await client
      .post('/add-services-to-student-profile/' + fakeStudent.studentProfileId)
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
    firstAchievementId = response.body().achievement.id
    firstAchievementDetailId = response.body().details[0].id
    secondAchievementDetailId = response.body().details[1].id
    thirdAchievementDetailId = response.body().details[2].id
    fourthAchievementDetailId = response.body().details[3].id
  })

  test('Add a second Achievement for the same student with 2 details', async ({ client }) => {
    const response = await client
      .post('/add-achievements-to-student-profile/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image1Path)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        service_id: secondServiceOfFirstProfessionId,
        title: 'Projet de site internet',
        description: 'Projet fictif de site internet pour une entreprise fictive',
        context: "J'ai réalisé un projet de site internet en tant que graphiste",
        date: '2020-11-15',
        is_favorite: false,
      })
    response.assertStatus(200)
    secondAchievementId = response.body().achievement.id
  })

  test('Add an other achievement detail to the second achievement by the student himself', async ({
    client,
  }) => {
    const response = await client
      .post(
        '/add-achievement-details-to-achievement/' +
          secondAchievementId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
      .file('achievement_details', image2Path)
      .file('achievement_details', image3Path)
      .fields({
        type: 'image',
        name: 'Image de la planète',
        caption: 'Image de la planète à conquérir',
      })
    response.assertStatus(200)
  })

  test('Add a fourth achievement detail to the second achievement without file by the student himself', async ({
    client,
  }) => {
    const response = await client
      .post(
        '/add-achievement-details-to-achievement/' +
          secondAchievementId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        type: 'url',
        name: 'Lien du site',
        caption: 'Découvrez en plus',
        value: 'https://www.example.com',
      })
    response.assertStatus(200)
  })

  test('Get Student profile to check if the achievements are well added', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const firstAchievement = achievements.find((a) => a.id === firstAchievementId)
    const secondAchievement = achievements.find((a) => a.id === secondAchievementId)
    assert.exists(firstAchievement)
    assert.exists(secondAchievement)
  })

  test('Get Student Profile to check if the achievements details are well added', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const firstAchievement = achievements.find((a) => a.id === firstAchievementId)
    const secondAchievement = achievements.find((a) => a.id === secondAchievementId)
    assert.exists(firstAchievement)
    assert.exists(secondAchievement)
    const firstAchievementDetails = firstAchievement.achievementDetails
    const secondAchievementDetails = secondAchievement.achievementDetails
    assert.exists(firstAchievementDetails)
    assert.exists(secondAchievementDetails)
    assert.equal(firstAchievementDetails.length, 4)
    assert.equal(secondAchievementDetails.length, 5)
  })

  test('Update an achievement by a client', async ({ client }) => {
    const response = await client
      .patch(
        '/update-achievement/' + secondAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
      .file('main_image_file', image2Path)
      .fields({
        service_id: secondServiceOfFirstProfessionId,
        title: 'Projet de site web',
        description: 'Projet fictif de site web pour une entreprise fictive',
        context: "J'ai réalisé un projet de site web en tant que graphiste",
        date: '2022-11-24',
        is_favorite: false,
      })
    response.assertStatus(401)
  })

  test('Update an achievement by an other student', async ({ client }) => {
    const response = await client
      .patch(
        '/update-achievement/' + secondAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
      .file('main_image_file', image2Path)
      .fields({
        service_id: secondServiceOfFirstProfessionId,
        title: 'Projet de site web',
        description: 'Projet fictif de site web pour une entreprise fictive',
        context: "J'ai réalisé un projet de site web en tant que graphiste",
        date: '2022-11-24',
        is_favorite: false,
      })
    response.assertStatus(401)
  })

  test('Update an achievement by the student himself', async ({ client }) => {
    const response = await client
      .patch(
        '/update-achievement/' + secondAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
      .file('main_image_file', image2Path)
      .fields({
        service_id: secondServiceOfFirstProfessionId,
        title: 'Projet de site web',
        description: 'Projet fictif de site web pour une entreprise fictive',
        context: "J'ai réalisé un projet de site web en tant que graphiste",
        date: '2022-11-24',
        is_favorite: false,
      })
    response.assertStatus(200)
  })

  test('Get Student profile to check if the achievements are well updated', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const secondAchievement = achievements.find((a) => a.id === secondAchievementId)
    assert.exists(secondAchievement)
    assert.equal(secondAchievement.title, 'Projet de site web')
    assert.equal(
      secondAchievement.description,
      'Projet fictif de site web pour une entreprise fictive'
    )
    assert.equal(
      secondAchievement.context,
      "J'ai réalisé un projet de site web en tant que graphiste"
    )
    assert.equal(secondAchievement.date, '2022-11-24')
    assert.equal(secondAchievement.is_favorite, false)
  })

  test('Update an achievement detail by a client', async ({ client }) => {
    const response = await client
      .patch(
        '/update-achievement-detail/' +
          secondAchievementId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
      .file('file', image3Path)
      .fields({
        type: 'image',
        name: 'Image de la planète',
        caption: 'Image de la planète à conquérir',
      })
    response.assertStatus(401)
  })

  test('Update an achievement detail by an other student', async ({ client }) => {
    const response = await client
      .patch(
        '/update-achievement-detail/' +
          secondAchievementId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
      .file('file', image3Path)
      .fields({
        type: 'image',
        name: 'Image de la planète',
        caption: 'Image de la planète à conquérir',
      })
    response.assertStatus(401)
  })

  test('Update an achievement detail by the student himself', async ({ client }) => {
    const response = await client
      .patch(
        '/update-achievement-detail/' +
          firstAchievementDetailId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
      .file('file', image3Path)
      .fields({
        type: 'image',
        name: 'Image de la planète',
        caption: 'Image de la planète à conquérir',
      })
    response.assertStatus(200)
  })

  test('Get Student profile to check if the achievements details are well updated', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const firstAchievement = achievements.find((a) => a.id === firstAchievementId)
    assert.exists(firstAchievement)
    const details = firstAchievement.achievementDetails
    const updatedDetail = details.find((a) => a.id === firstAchievementDetailId)
    assert.exists(updatedDetail)
    assert.equal(updatedDetail.name, 'Image de la planète')
    assert.equal(updatedDetail.caption, 'Image de la planète à conquérir')
  })

  test('Update the order of the achievements', async ({ client }) => {
    const reorderedAchievements: {
      id: number
      order: number
    }[] = [
      { id: secondAchievementId, order: 1 },
      { id: firstAchievementId, order: 2 },
    ]
    const response = await client
      .patch(
        '/update-achievements/' +
          fakeStudent.studentProfileId +
          '/order/' +
          secondServiceOfFirstProfessionId
      )
      .header('Cookie', fakeStudent.tokenCookie)
      .json({ achievements: reorderedAchievements })
    response.assertStatus(204)
  })

  test('Update the order of the achievement details', async ({ client }) => {
    const reorderedDetails: {
      id: number
      order: number
    }[] = [
      { id: secondAchievementDetailId, order: 1 },
      { id: firstAchievementDetailId, order: 2 },
      { id: fourthAchievementDetailId, order: 3 },
      { id: thirdAchievementDetailId, order: 4 },
    ]
    const response = await client
      .patch(
        '/update-achievement/' +
          fakeStudent.studentProfileId +
          '/details-order/' +
          firstAchievementId
      )
      .header('Cookie', fakeStudent.tokenCookie)
      .json({ achievement_details: reorderedDetails })
    response.assertStatus(204)
  })

  test('Get the student profile to check if the achievements are well ordered', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const firstAchievement = achievements.find((a) => a.id === secondAchievementId)
    const secondAchievement = achievements.find((a) => a.id === firstAchievementId)
    if (firstAchievement && secondAchievement) {
      assert.equal(firstAchievement.achievement_order, 1)
      assert.equal(secondAchievement.achievement_order, 2)
    } else {
      assert.fail('Achievements not found')
    }
  })

  test('Get the student profile to check if the achievement details are well ordered', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const firstAchievement = achievements.find((a) => a.id === firstAchievementId)
    if (firstAchievement) {
      const details = firstAchievement.achievementDetails
      const firstDetail = details.find((a) => a.id === firstAchievementDetailId)
      const secondDetail = details.find((a) => a.id === secondAchievementDetailId)
      const thirdDetail = details.find((a) => a.id === thirdAchievementDetailId)
      const fourthDetail = details.find((a) => a.id === fourthAchievementDetailId)
      if (firstDetail && secondDetail && thirdDetail && fourthDetail) {
        assert.equal(firstDetail.detail_order, 2)
        assert.equal(secondDetail.detail_order, 1)
        assert.equal(thirdDetail.detail_order, 4)
        assert.equal(fourthDetail.detail_order, 3)
      } else {
        assert.fail('Details not found')
      }
    } else {
      assert.fail('Achievement not found')
    }
  })

  test('Delete an achievement detail by a client', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement-detail/' +
          secondAchievementDetailId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete an achievement detail by an other student', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement-detail/' +
          secondAchievementDetailId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete an achievement detail by the student himself', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement-detail/' +
          secondAchievementDetailId +
          '/by-student/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(204)
  })

  test('Delete an achievement by a client', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement/' + firstAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete an achievement by an other student', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement/' + firstAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete an achievement by the student himself', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement/' + firstAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(204)
  })

  test('Delete the second achievement by the student himself', async ({ client }) => {
    const response = await client
      .delete(
        '/delete-achievement/' + secondAchievementId + '/by-student/' + fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(204)
  })

  test('Get Student profile to check if the achievements are well deleted', async ({
    client,
    assert,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    const achievements = response.body().achievements
    const firstAchievement = achievements.find((a) => a.id === firstAchievementId)
    const secondAchievement = achievements.find((a) => a.id === secondAchievementId)
    assert.notExists(firstAchievement)
    assert.notExists(secondAchievement)
  })
})
