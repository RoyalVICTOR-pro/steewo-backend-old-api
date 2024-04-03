import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'missions_services_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('mission_has_service_id').unsigned().notNullable()
      table.integer('service_form_field_id').unsigned().notNullable()
      table.string('label', 100).nullable()
      table.text('file_caption').nullable()
      table.text('value').nullable()
      table.integer('order').nullable()

      table
        .foreign('mission_has_service_id')
        .references('id')
        .inTable('missions_has_services')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table
        .foreign('service_form_field_id')
        .references('id')
        .inTable('services_form_fields')
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
