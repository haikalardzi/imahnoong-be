import { getAllReservations, getReservationByUser, createReservation, checkApprovedReservationNow } from "./reservation.service.js";

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
        const data = await getReservationByUser(req.params.username);
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function makeReservation(req, reply) {
    try{
        const data = await createReservation(req.body);
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function checkControl (req, reply) {
    const isAllowed = await checkApprovedReservationNow(req.user.id);
    if (!isAllowed && req.user.role !== 'admin') {
        return reply.code(403).send({ error: 'Not in control time window' });
    }

    return { allowed: true };
}