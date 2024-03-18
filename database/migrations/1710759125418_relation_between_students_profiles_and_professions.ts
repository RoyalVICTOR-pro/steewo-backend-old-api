import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles_has_professions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_profile_id').unsigned().references('student_profiles.id')
      table.integer('profession_id').unsigned().references('professions.id')
      table.index(['student_profile_id', 'profession_id'], 'student_profession_relation')
      table.tinyint('profession_has_been_accepted').defaultTo(0)
      table.tinyint('waiting_validation').defaultTo(0)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
