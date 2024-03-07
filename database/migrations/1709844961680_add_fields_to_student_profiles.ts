import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('gender').nullable()
      table.string('study_level', 20).nullable()
      table.string('photo_file', 255).nullable()
      table.string('banner_file', 255).nullable()
      table.string('school_certificate_file', 255).nullable()
      table.string('company_exists_proof_file', 255).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gender')
      table.dropColumn('study_level')
      table.dropColumn('photo_file')
      table.dropColumn('banner_file')
      table.dropColumn('school_certificate_file')
      table.dropColumn('company_exists_proof_file')
    })
  }
}
