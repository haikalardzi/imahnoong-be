/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns 
 */
export function up(knex) {
  return knex.schema.alterTable('user_reservation', (table) => {
    table.text('deskripsi').nullable();
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('deskripsi');
  });
}
