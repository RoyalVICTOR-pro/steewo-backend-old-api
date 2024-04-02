import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('has_enabled_notifications', 'has_enabled_email_notifications')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('has_enabled_email_notifications', 'has_enabled_notifications')
    })
  }
}
