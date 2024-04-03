import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'missions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('client_profiles_id').unsigned().notNullable()
      table.string('name', 100).notNullable()
      table.text('description', 'medium').nullable()
      table.text('message_for_student', 'tiny').nullable()
      table.string('status', 45).notNullable()
      table.integer('engagement_acceptation').nullable()
      table.date('planned_due_date').nullable()
      table.integer('planned_round_trips_number').nullable()
      table.decimal('price').nullable()
      table.decimal('steewo_commission').nullable()
      table.integer('payment_status').nullable()
      table.string('student_invoice_path', 255).nullable()
      table.string('client_invoice_path', 255).nullable()
      table.integer('number_of_views').nullable()
      table.boolean('has_been_created_by_student').defaultTo(false)

      table
        .foreign('client_profiles_id')
        .references('id')
        .inTable('client_profiles')
        .onDelete('NO ACTION')
        .onUpdate('NO ACTION')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
