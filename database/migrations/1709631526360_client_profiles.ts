import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'client_profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.string('firstname', 60).nullable()
      table.string('lastname', 60).nullable()
      table.date('date_of_birth').nullable()
      table.string('phone', 20).nullable()
      table.string('address_number', 10).nullable()
      table.string('address_road', 255).nullable()
      table.string('address_postal_code', 20).nullable()
      table.string('address_city', 150).nullable()
      table.string('company_name', 100).nullable()
      table.string('position', 150).nullable()
      table.string('siret_number', 30).nullable()
      table.string('bank_iban', 45).nullable()
      table.float('average_rating').nullable()
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
