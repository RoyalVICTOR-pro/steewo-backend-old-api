import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'client_profiles'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('gender').nullable()
      table.string('photo_file', 255).nullable()
      table.text('description').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gender')
      table.dropColumn('photo_file')
      table.dropColumn('description')
    })
  }
}
