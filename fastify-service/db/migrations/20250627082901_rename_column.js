export function up(knex) {
  return knex.schema.alterTable('observation_records', (table) => {
    table.renameColumn('right_ascention', 'right_ascension');
  });
}

export function down(knex) {
  return knex.schema.alterTable('observation_records', (table) => {
    table.renameColumn('right_ascension', 'right_ascention');
  });
}