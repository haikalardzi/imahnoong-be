import { getAllReservations, getReservationByUser, createReservation, deleteReservation, editReservationStatus } from "./reservation.service.js";

export async function getAllReservationHandler(req, reply) {
    try {
        const data = await getAllReservations();
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function getReservationByUserHandler(req, reply) {
    try {
        const data = await getReservationByUser(req.params.username);
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function createReservationHandler(req, reply) {
    try {
        const data = await createReservation(req.body);
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function editReservationStatusHandler(req, reply) {
    try {
        await editReservationStatus(req.params.id, req.body.status);
        reply.send({ message: 'Reservation edited' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function deleteReservationHandler(req, reply) {
    try {
        const { id } = req.body;
        await deleteReservation(id);
        reply.send({ message: 'Reservation deleted' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}