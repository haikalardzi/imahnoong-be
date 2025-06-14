/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns 
 */
export function up(knex) {
  return knex.schema.alterTable('user_reservation', (table) => {
    table.dropColumn('tanggal');
    table.dropColumn('waktu_mulai');
    table.dropColumn('waktu_selesai');
    table.dateTime('observasi_mulai').notNullable();
    table.dateTime('observasi_selesai').notNullable();
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.date('tanggal').notNullable();
    table.time('waktu_mulai').notNullable();
    table.time('waktu_selesai').notNullable();
    table.dropColumn('observasi_mulai');
    table.dropColumn('observasi_selesai');
 });
}
