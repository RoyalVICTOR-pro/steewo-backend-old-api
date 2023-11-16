import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public order = 2

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('countries_id')
        .unsigned()
        .references('id')
        .inTable('countries')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.string('email', 255).notNullable().unique().index()
      table.string('password', 180).nullable()
      table.string('remember_me_token').nullable()
      table.integer('role').nullable()
      table.string('status', 45).nullable()
      table.string('user_language', 5).notNullable()
      table.dateTime('privacy_acceptation').nullable()
      table.dateTime('cgv_acceptation').nullable()
      table.string('email_validation_token', 255).nullable()
      table.tinyint('is_valid_email').defaultTo(0)
      table.string('internal_or_sso', 15).notNullable()
      table.string('sso_provider_id', 255).nullable()
      table.string('password_forgotten', 255).nullable()
      table.dateTime('password_forgotten_datetime').nullable()
      table.tinyint('has_enabled_notifications').defaultTo(0)
      table.tinyint('has_accepted_steewo_Charter').defaultTo(0)

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
