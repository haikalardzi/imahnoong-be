export async function up(knex) {
  await knex.schema.createTable('observation_records', (table) => {
    table.increments('id').primary(); // Primary Key

    table.string('username').notNullable(); // FK to users.username
    table.foreign('username').references('username').inTable('users').onDelete('CASCADE');

    table.string('filename').notNullable(); // filename + extension
    table.string('object_name').notNullable();

    table.timestamp('datetime').notNullable();

    table.float('distance').notNullable();
    table.string('constellation').notNullable();
    table.string('declination').notNullable();
    table.string('right_ascension').notNullable();
    table.string('altitude').notNullable();
    table.string('azimuth').notNullable();

    table.text('description'); // Optional

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.boolean('is_deleted').defaultTo(false).notNullable();
    
  });
  await knex.raw(`GRANT ALL PRIVILEGES ON TABLE observation_records TO demo`);
  await knex.raw(`GRANT ALL PRIVILEGES ON SEQUENCE observation_records_id_seq TO demo`);
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('observation_records');
}
