import db from "../../config/db.js";

export async function getAllReservations() {
    return db('user_reservation').select('*');
}

export async function getReservationByUser(user_id) {
    return db('user_reservation').where({ user_id: user_id });
}