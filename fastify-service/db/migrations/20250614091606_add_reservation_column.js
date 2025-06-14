/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns 
 */
export function up(knex) {
  return knex.schema.alterTable('user_reservation', (table) => {
    table.string('nama').notNullable();
    table.date('tanggal').notNullable();
    table.time('waktu_mulai').notNullable();
    table.time('waktu_selesai').notNullable();
    table.string('email').notNullable();
    table.string('deskripsi').nullable();
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('observasi_mulai');
    table.dropColumn('observasi_selesai');
    table.dropColumn('nama');
    table.dropColumn('tanggal');
    table.dropColumn('waktu_mulai');
    table.dropColumn('waktu_selesai');
    table.dropColumn('email');
    table.dropColumn('deskripsi');
  });
}
