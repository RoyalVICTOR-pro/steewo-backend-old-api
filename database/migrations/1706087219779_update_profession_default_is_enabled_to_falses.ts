import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'professions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_enabled').defaultTo(false).notNullable().alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_enabled').defaultTo(true).notNullable().alter()
    })
  }
}
