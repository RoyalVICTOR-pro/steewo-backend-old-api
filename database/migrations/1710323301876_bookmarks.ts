import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('student_profile_id').unsigned().references('student_profiles.id')
      table.integer('client_profile_id').unsigned().references('client_profiles.id')
      table.index(['student_profile_id', 'client_profile_id'], 'bookmark_unique')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
