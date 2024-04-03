import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'missions_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('file', 255).nullable()
      table.integer('mission_id').unsigned().notNullable()
      table
        .foreign('mission_id')
        .references('id')
        .inTable('missions')
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
