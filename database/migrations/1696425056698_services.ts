import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('professions_id').unsigned().notNullable().index()
      table.string('name_fr', 70).notNullable()
      table.string('short_name_fr', 40).notNullable()
      table.string('picto_file', 255).nullable()
      table.string('image_file', 255).nullable()
      table.tinyint('is_enabled').notNullable().defaultTo(0)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table
        .foreign('professions_id')
        .references('id')
        .inTable('professions')
        .onDelete('CASCADE')
        .onUpdate('NO ACTION')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
