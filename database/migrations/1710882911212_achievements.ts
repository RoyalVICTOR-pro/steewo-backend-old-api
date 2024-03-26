import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'achievements'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('student_profile_id')
        .unsigned()
        .references('student_profiles.id')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table
        .integer('service_id')
        .unsigned()
        .references('services.id')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.date('date').nullable()
      table.string('title', 60)
      table.text('context').nullable()
      table.text('description').nullable()
      table.string('main_image_file', 255).nullable()
      table.boolean('is_favorite').defaultTo(false)
      table.integer('achievement_order').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
