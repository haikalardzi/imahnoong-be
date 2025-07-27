export function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    // table.timestamp('observasi_mulai').nullable();
    // table.timestamp('observasi_selesai').nullable();
    // table.enum('role', ['user', 'admin']).defaultTo('user');
  });
}

export function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    // table.dropColumn('observasi_mulai');
    // table.dropColumn('observasi_selesai');
    // table.dropColumn('role');
  });
}
