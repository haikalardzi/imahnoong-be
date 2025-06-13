import { getAllReservations, getReservationByUser } from "./reservation.service.js";

export async function fetchAllReservation(req, reply) {
    try{
        const data = await getAllReservations();
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function fetchUserReservation(req, reply){
    try{
        const data = await getReservationByUser(req.params.user_id);
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}