export async function seed(knex) {
  await knex('user_reservation').del();
  await knex('user_reservation').insert([
    {
      user_id: 5,
      tanggal: '2025-06-14',
      waktu_mulai: '08:00:00',
      waktu_selesai: '09:00:00',
      nama: 'test',
      email: 'test@gmail.com',
      deskripsi: 'test asdsadas asdsad',
      status: 'pending',
    },
  ]);
}
