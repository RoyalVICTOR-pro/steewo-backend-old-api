import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services_form_fields'

  public order = 9

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('service_id').unsigned().notNullable()
      table.integer('order').nullable()
      table.string('type', 20).nullable()
      table.string('label_fr', 100).nullable()
      table.boolean('mandatory').defaultTo(0)
      table.string('tooltip_image_file', 255).nullable()
      table.text('tooltip_text_fr').nullable()
      table.string('description_fr', 255).nullable()
      table.string('placeholder_fr', 70).nullable()
      table.primary(['id', 'service_id'])
      table
        .foreign('service_id')
        .references('id')
        .inTable('services')
        .onUpdate('NO ACTION')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
