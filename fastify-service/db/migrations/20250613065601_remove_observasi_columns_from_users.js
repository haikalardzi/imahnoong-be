/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('observasi_mulai');
    table.dropColumn('observasi_selesai');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.datetime('observasi_mulai');
    table.datetime('observasi_selesai');
  });
}
