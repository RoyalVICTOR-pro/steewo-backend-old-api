import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles_has_services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_profile_id').unsigned().references('student_profiles.id')
      table.integer('service_id').unsigned().references('services.id')
      table.index(['student_profile_id', 'service_id'], 'student_service_relation')
      table.tinyint('service_has_been_accepted').defaultTo(0)
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
