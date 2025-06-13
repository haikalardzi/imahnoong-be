export async function seed(knex) {
  await knex('user_reservation').del();
  await knex('user_reservation').insert([
    {
      user_id: 5,
      observasi_mulai: new Date(),
      observasi_selesai: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'pending',
    },
  ]);
}
