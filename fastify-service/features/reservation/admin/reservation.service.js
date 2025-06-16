import db from "../../../config/db.js";

export async function getAllReservations() {
    return db('user_reservation')
        .select(['id', 'user_id', 'nama as title', 'email', 'observasi_mulai as start', 'observasi_selesai as end', 'status', 'deskripsi as desc'])
        .orderBy('id', 'asc');
}

export async function getReservationByUser(username) {
    const user_id = await db('users').where({ username: username }).first().select('id');
    return db('user_reservation').select(['id', 'user_id', 'nama as title', 'email', 'observasi_mulai as start', 'observasi_selesai as end', 'status', 'deskripsi as desc']).where({ user_id: user_id.id });
}

export async function createReservation(reservation) {
    const user = await db('users').where({ username: reservation.username }).first().select('id');
    const observasi_mulai = new Date(reservation.date + ' ' + reservation.start).toISOString();
    const observasi_selesai = new Date(reservation.date + ' ' + reservation.end).toISOString();
    return db('user_reservation').insert({ user_id: user.id, observasi_mulai, observasi_selesai, nama: reservation.name, email: reservation.email, deskripsi: reservation.description });
}

export async function editReservationStatus(id, status) {
    return db('user_reservation').where({ id }).update({ status });
}

export async function deleteReservation(id) {
    return db('user_reservation').where({ id }).update({ is_deleted: true }).returning('*').first();
}