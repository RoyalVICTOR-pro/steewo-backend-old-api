import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable()
      table.string('title', 255).nullable()
      table.text('content').nullable()
      table.string('link_to_go', 255).nullable()
      table.boolean('has_been_read').defaultTo(false).nullable()
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
