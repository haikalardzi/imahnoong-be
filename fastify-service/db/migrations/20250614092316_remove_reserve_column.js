/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns 
 */
export function up(knex) {
  return knex.schema.alterTable('user_reservation', (table) => {
    table.dropColumn('observasi_mulai');
    table.dropColumn('observasi_selesai');
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.timestamp('observasi_mulai').nullable();
    table.timestamp('observasi_selesai').nullable();
  });
}
