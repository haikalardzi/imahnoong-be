/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns 
 */
export function up(knex) {
  return knex.schema.createTable('user_reservation', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('nama').notNullable();
    table.string('email').notNullable();
    table.text('deskripsi').nullable();
    table.dateTime('observasi_mulai').notNullable();
    table.dateTime('observasi_selesai').notNullable();
    table.string('status').defaultTo('pending'); // e.g. 'pending', 'approved', 'rejected'
    table.timestamps(true, true); // created_at, updated_at
  });
}

export function down(knex) {
  return knex.schema.dropTable('user_reservation');
}