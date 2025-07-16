import db from "../../../config/db.js";

export async function getAllReservations() {
    return db('user_reservation').select(['id', 'user_id', 'nama as title', 'email', 'observasi_mulai as start', 'observasi_selesai as end', 'deskripsi as desc', 'status']).orderBy('id', 'asc');
}

export async function getReservationByUser(username) {
    const user_id = await db('users').where({ username: username }).first().select('id');
    return db('user_reservation').select(['id', 'user_id', 'nama as title', 'email', 'observasi_mulai as start', 'observasi_selesai as end', 'deskripsi as desc', 'status']).where({ user_id: user_id.id });
}

export async function createReservation(reservation) {
    const user = await db('users')
      .select('id')
      .where({ username: reservation.username })
      .first();

    if (!user) throw new Error ('User not found!');
    
    const observasi_mulai = new Date(`${reservation.date_start} ${reservation.time_start}`).toISOString();
    const observasi_selesai = new Date(`${reservation.date_end} ${reservation.time_end}`).toISOString();
    const now = new Date();

    if (observasi_mulai < now){
      return { error: 'Tidak bisa reservasi sebelum waktu sekarang!'};
    }

    const conflict = await db('user_reservation')
      .where(function (){
        this.where('observasi_mulai', '<', observasi_selesai)
          .andWhere('observasi_selesai', '>', observasi_mulai);
      })
      .first();
    
    if (conflict){
      return { error: 'Ada rentang jam observasi yang sudah di reservasi!'};
    }
    return db('user_reservation').insert({ user_id: user.id, observasi_mulai, observasi_selesai, nama: reservation.name, email: reservation.email, deskripsi: reservation.description });
}

export async function checkApprovedReservationNow(userId) {
  const now = new Date().toISOString();

  const result = await db('user_reservation')
    .where('user_id', userId)
    .andWhere('status', 'approved')
    .andWhere('observasi_mulai', '<=', now)
    .andWhere('observasi_selesai', '>=', now)
    .andWhere('disable', false)
    .first();

  return !!result;
}