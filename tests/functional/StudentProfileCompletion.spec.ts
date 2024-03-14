import { DateTime } from 'luxon'
import { FakeClientForTest } from './helpers/Client.helper'
import { FakeStudentForTest } from './helpers/Student.helper'
import { test } from '@japa/runner'
import Gender from '@Enums/Gender'
import Role from '@Enums/Roles'
import StudentUserStatus from '@Enums/StudentUserStatus'
import supertest from 'supertest'

const BASE_URL = `${process.env.TEST_API_URL}`
const testPath = './tests/functional/files_for_tests/'

const student1BannerGoodFilePath = testPath + 'student_good_banner.jpg'
const student1BannerTooBigFilePath = testPath + 'student_big_banner.jpg'
const student1BannerWrongFileTypePath = testPath + 'student_wrong_banner.pptx'

const student1CompanyProofGoodFilePath = testPath + 'student_good_proof.pdf'
const student1CompanyProofTooBigFilePath = testPath + 'student_big_proof.pdf'
const student1CompanyProofWrongFileTypePath = testPath + 'student_wrong_proof.docx'

const student1PhotoGoodFilePath = testPath + 'student_good_photo.png'
const student1PhotoTooBigFilePath = testPath + 'student_big_photo.jpg'
const student1PhotoWrongFileTypePath = testPath + 'student_wrong_photo.gif'

const student1SchoolCertificateGoodFilePath = testPath + 'student_good_certificate.pdf'
const student1SchoolCertificateTooBigFilePath = testPath + 'student_big_certificate.pdf'
const student1SchoolCertificateWrongFileTypePath = testPath + 'student_wrong_certificate.xlsx'

let registeredSchoolCertificateFilePath: string
let registeredCompanyExistsProofFilePath: string
let registeredPhotoFilePath: string
let registeredBannerFilePath: string

test.group('Student Profile Completion Process', (group) => {
  let fakeStudent = new FakeStudentForTest()
  let secondFakeStudent = new FakeStudentForTest('arya.stark@winterfell.com')
  let fakeClient = new FakeClientForTest()

  group.setup(async () => {
    await fakeClient.registerFakeClient()
    await fakeClient.validateClientEmail()
    await fakeClient.loginFakeClient()
    await fakeStudent.registerFakeStudent()
    await fakeStudent.validateStudentEmail()
    await fakeStudent.loginFakeStudent()
    await secondFakeStudent.registerFakeStudent()
    await secondFakeStudent.validateStudentEmail()
    await secondFakeStudent.loginFakeStudent()
  })

  group.teardown(async () => {
    await fakeStudent.deleteFakeStudent()
    await secondFakeStudent.deleteFakeStudent()
    await fakeClient.deleteFakeClient()
  })

  test('Get Student Public Profile by a client before profile registration', async ({ client }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(404)
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
    console.log('Student Profile created:', body)
    console.log('Student Profile ID:', body.id)
    fakeStudent.studentProfileId = body.id
  })

  test('Get Student Public Profile by an unauthenticated user', async ({ client }) => {
    const response = await client.get('/get-student-public-profile/' + fakeStudent.userId)
    response.assertStatus(401)
  })
  test('Get Student Public Profile by a client before getting validated by Steewo', async ({
    client,
  }) => {
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(403)
  })
  test('Get Student Public Profile by a client after getting validated by Steewo', async ({
    client,
    assert,
  }) => {
    await fakeStudent.validateStudentProfile()
    const response = await client
      .get('/get-student-public-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      firstname: 'Fabien',
      lastname: 'Garp',
      current_diploma: 'Directeur graphique',
      current_school: 'MJM Graphic Design',
      last_diploma: 'Bac Scientifique',
      last_diploma_school: 'Lycée Condorcet',
    })
    assert.notInclude(response.body, { date_of_birth: DateTime.fromISO('1984-08-24').toISO() })
  })
  test('Get Student Private Profile by a client', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })
  test('Get Student Private Profile by an other student', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Private Profile by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      firstname: 'Fabien',
      lastname: 'Garp',
      current_diploma: 'Directeur graphique',
      current_school: 'MJM Graphic Design',
      last_diploma: 'Bac Scientifique',
      last_diploma_school: 'Lycée Condorcet',
      date_of_birth: DateTime.fromISO('1984-08-24').toISO(),
    })
  })

  test('Update Student Profile Main Info by a client', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        firstname: 'John',
        lastname: 'Snow',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
      })
    response.assertStatus(401)
  })
  test('Update Student Profile Main Info by an other student', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', secondFakeStudent.tokenCookie)
      .fields({
        firstname: 'John',
        lastname: 'Snow',
        date_of_birth: '1984-08-24',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
      })
    response.assertStatus(401)
  })

  test('Update Student Profile Main Info by the student himself with full data but invalid gender', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        address_city: 'Paris',
        address_number: '5',
        address_postal_code: '75000',
        address_road: 'Rue de Rivoli',
        bank_iban: 'FR14 2004 1010 0505 0001 3M02 606',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        date_of_birth: '1984-08-24',
        firstname: 'John',
        gender: 'Male',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Snow',
        mobile: '0601020304',
        place_of_birth: 'Winterfell',
        siret_number: '12345678901234',
      })
    response.assertStatus(422)
  })

  test('Update Student Profile Main Info by the student himself with missing current_diploma', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: '',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with missing current_school', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: '',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with missing firstname', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: '',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with missing gender', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with missing last_diploma', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: '',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with missing last_diploma_school', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: '',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with a space in last_diploma_school', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: ' ',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with missing lastname', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: '',
      })
    response.assertStatus(422)
  })

  test('Update Student Profile Main Info by the student himself with only required fields', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        date_of_birth: '1984-08-24',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(200)
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      current_diploma: 'Directeur graphique',
      current_school: 'MJM Graphic Design',
      date_of_birth: DateTime.fromISO('1984-08-24').toISO(),
      firstname: 'Ramsey',
      gender: Gender.MALE,
      last_diploma: 'Bac Scientifique',
      last_diploma_school: 'Lycée Condorcet',
      lastname: 'Bolton',
    })
  })

  test('Update Student Profile Main Info by the student himself with full valid data', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('school_certificate_file', student1SchoolCertificateGoodFilePath)
      .file('company_exists_proof_file', student1CompanyProofGoodFilePath)
      .fields({
        address_city: 'Paris',
        address_number: '5',
        address_postal_code: '75000',
        address_road: 'Rue de Rivoli',
        bank_iban: 'FR14 2004 1010 0505 0001 3M02 606',
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        date_of_birth: '1984-08-24',
        firstname: 'John',
        gender: Gender.MALE,
        job_title: 'Directeur Artistique',
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Snow',
        mobile: '0601020304',
        place_of_birth: 'Winterfell',
        siret_number: '12345678901234',
      })
    response.assertStatus(200)
    registeredSchoolCertificateFilePath = response.body().school_certificate_file
    registeredCompanyExistsProofFilePath = response.body().company_exists_proof_file
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      address_city: 'Paris',
      address_number: '5',
      address_postal_code: '75000',
      address_road: 'Rue de Rivoli',
      bank_iban: 'FR14 2004 1010 0505 0001 3M02 606',
      current_diploma: 'Directeur graphique',
      current_school: 'MJM Graphic Design',
      date_of_birth: DateTime.fromISO('1984-08-24').toISO(),
      firstname: 'John',
      gender: Gender.MALE,
      job_title: 'Directeur Artistique',
      last_diploma: 'Bac Scientifique',
      last_diploma_school: 'Lycée Condorcet',
      lastname: 'Snow',
      mobile: '0601020304',
      place_of_birth: 'Winterfell',
      siret_number: '12345678901234',
      school_certificate_file: registeredSchoolCertificateFilePath,
      company_exists_proof_file: registeredCompanyExistsProofFilePath,
    })
  })

  test('Update Student Profile Main Info by the student himself with wrong certificate file type', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('school_certificate_file', student1SchoolCertificateWrongFileTypePath)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with wrong company proof file type', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('school_certificate_file', student1CompanyProofWrongFileTypePath)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with too big certificate file', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('school_certificate_file', student1SchoolCertificateTooBigFilePath)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })
  test('Update Student Profile Main Info by the student himself with too big company proof file', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('school_certificate_file', student1CompanyProofTooBigFilePath)
      .fields({
        current_diploma: 'Directeur graphique',
        current_school: 'MJM Graphic Design',
        firstname: 'Ramsey',
        gender: Gender.MALE,
        last_diploma: 'Bac Scientifique',
        last_diploma_school: 'Lycée Condorcet',
        lastname: 'Bolton',
      })
    response.assertStatus(422)
  })

  test('Update Student Profile Photo by a client', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/photo')
      .header('Cookie', fakeClient.tokenCookie)
      .file('photo_file', student1PhotoGoodFilePath)
    response.assertStatus(401)
  })
  test('Update Student Profile Photo by an other student', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/main')
      .header('Cookie', secondFakeStudent.tokenCookie)
      .file('photo_file', student1PhotoGoodFilePath)
    response.assertStatus(401)
  })

  test('Update Student Profile Photo by the student himself with wrong photo file type', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/photo')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('photo_file', student1PhotoWrongFileTypePath)
    response.assertStatus(422)
  })

  test('Update Student Profile Photo by the student himself with too big photo file', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/photo')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('photo_file', student1PhotoTooBigFilePath)
    response.assertStatus(422)
  })

  test('Update Student Profile Photo by the student himself with good photo', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/photo')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('photo_file', student1PhotoGoodFilePath)
    response.assertStatus(200)
    registeredPhotoFilePath = response.body().photo_file
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      photo_file: registeredPhotoFilePath,
    })
  })

  test('Update Student Profile Banner by a client', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/banner')
      .header('Cookie', fakeClient.tokenCookie)
      .file('banner_file', student1BannerGoodFilePath)
    response.assertStatus(401)
  })

  test('Update Student Profile Banner by an other student', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/banner')
      .header('Cookie', secondFakeStudent.tokenCookie)
      .file('banner_file', student1BannerGoodFilePath)
    response.assertStatus(401)
  })

  test('Update Student Profile Banner by the student himself with wrong banner file type', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/banner')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('banner_file', student1BannerWrongFileTypePath)
    response.assertStatus(422)
  })

  test('Update Student Profile Banner by the student himself with too big banner file', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/banner')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('banner_file', student1BannerTooBigFilePath)
    response.assertStatus(422)
  })

  test('Update Student Profile Banner by the student himself with good banner', async ({
    client,
  }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/banner')
      .header('Cookie', fakeStudent.tokenCookie)
      .file('banner_file', student1BannerGoodFilePath)
    response.assertStatus(200)
    registeredBannerFilePath = response.body().banner_file
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      banner_file: registeredBannerFilePath,
    })
  })

  test('Delete Student Profile Photo by a client', async ({ client }) => {
    const response = await client
      .delete('/delete-student-profile-photo/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete Student Profile Photo by an other student', async ({ client }) => {
    const response = await client
      .delete('/delete-student-profile-photo/' + fakeStudent.studentProfileId)
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete Student Profile Photo by the student himself', async ({ client }) => {
    const response = await client
      .delete('/delete-student-profile-photo/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(204)
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      photo_file: null,
    })
  })

  test('Delete Student Profile Banner by a client', async ({ client }) => {
    const response = await client
      .delete('/delete-student-profile-banner/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete Student Profile Banner by an other student', async ({ client }) => {
    const response = await client
      .delete('/delete-student-profile-banner/' + fakeStudent.studentProfileId)
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Delete Student Profile Banner by the student himself', async ({ client }) => {
    const response = await client
      .delete('/delete-student-profile-banner/' + fakeStudent.studentProfileId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(204)
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      banner_file: null,
    })
  })

  test('Update Student Profile Description by a client', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/description')
      .header('Cookie', fakeClient.tokenCookie)
      .fields({
        description: 'I am a student',
      })
    response.assertStatus(401)
  })

  test('Update Student Profile Description by an other student', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/description')
      .header('Cookie', secondFakeStudent.tokenCookie)
      .fields({
        description: 'I am a student',
      })
    response.assertStatus(401)
  })

  test('Update Student Profile Description by the student himself', async ({ client }) => {
    const response = await client
      .patch('/update-student-profile/' + fakeStudent.userId + '/description')
      .header('Cookie', fakeStudent.tokenCookie)
      .fields({
        description: 'I am a student',
      })
    response.assertStatus(200)
  })

  test('Check Student Profile after update', async ({ client }) => {
    const response = await client
      .get('/get-student-private-profile/' + fakeStudent.userId)
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      description: 'I am a student',
    })
  })
  /* 
  test('Get Student Views Count by a client', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Views Count by an other student', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(401)
  })

  test('Get Student Views Count by the student himself', async ({ client }) => {
    const response = await client
      .get('/get-student-views-count/')
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(200)
    response.assertBodyContains({
      total: 0,
    })
  })

  test('Add View to Student Profile by a client', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeClient.clientProfileId
      )
      .header('Cookie', fakeClient.tokenCookie)
    response.assertStatus(200)
  })

  test('Add View to Student Profile by an other student', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          secondFakeStudent.studentProfileId
      )
      .header('Cookie', secondFakeStudent.tokenCookie)
    response.assertStatus(400)
  })

  test('Add View to Student Profile by the student himself', async ({ client }) => {
    const response = await client
      .get(
        '/add-view-to-student-profile/' +
          fakeStudent.studentProfileId +
          '/from/' +
          fakeStudent.studentProfileId
      )
      .header('Cookie', fakeStudent.tokenCookie)
    response.assertStatus(400)
  }) 
  */
})
