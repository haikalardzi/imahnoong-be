/**
 * 
 * @param { import("knex").Knex } knex 
 * @returns 
 */
export function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    // table.boolean('disable').defaultTo(false);
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    // table.dropColumn('disable');
  });
}
