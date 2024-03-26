import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'achievement_details'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('achievement_id')
        .unsigned()
        .references('achievements.id')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.string('type', 15).nullable()
      table.text('value').nullable()
      table.string('file', 255).nullable()
      table.string('name', 70).nullable()
      table.string('caption', 255).nullable()
      table.integer('detail_order').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
