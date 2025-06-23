import { deleteRecord, getAllRecords } from './records.service.js';

/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 */
export async function deleteRecordHandler(req, reply) {
    try {
        const { id } = req.body;
        await deleteRecord(id);
        reply.send({ message: 'Record deleted' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function fetchAllRecordsHandler(req, reply) {
    try {
        const data = await getAllRecords();
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
    
}