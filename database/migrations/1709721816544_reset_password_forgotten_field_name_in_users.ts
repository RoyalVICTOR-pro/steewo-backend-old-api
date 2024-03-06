import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('password_forgotten', 'password_reset_token')
      table.renameColumn('password_forgotten_datetime', 'password_reset_token_expiration_datetime')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('password_reset_token', 'password_forgotten')
      table.renameColumn('password_reset_token_expiration_datetime', 'password_forgotten_datetime')
    })
  }
}
