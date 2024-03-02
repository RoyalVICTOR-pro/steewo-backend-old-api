import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'student_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('firstname', 60).nullable()
      table.string('lastname', 60).nullable()
      table.date('date_of_birth').nullable()
      table.string('place_of_birth', 45).nullable()
      table.string('mobile', 20).nullable()
      table.string('last_diploma', 100).nullable()
      table.string('last_diploma_school', 100).nullable()
      table.dateTime('last_diploma_start_date').nullable()
      table.dateTime('last_diploma_end_date').nullable()
      table.string('current_diploma', 100).nullable()
      table.string('current_school', 100).nullable()
      table.dateTime('current_diploma_start_date').nullable()
      table.dateTime('current_diploma_end_date').nullable()
      table.string('siret_number', 30).nullable()
      table.string('bank_iban', 45).nullable()
      table.text('description').nullable()
      table.float('average_rating').nullable()
      table.string('job_title', 255).nullable()
      table.string('address_number', 10).nullable()
      table.string('address_road', 255).nullable()
      table.string('address_postal_code', 20).nullable()
      table.string('address_city', 150).nullable()
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.timestamps()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
