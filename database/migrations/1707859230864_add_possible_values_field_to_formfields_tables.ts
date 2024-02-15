import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services_form_fields'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('possible_values').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('possible_values')
    })
  }
}
