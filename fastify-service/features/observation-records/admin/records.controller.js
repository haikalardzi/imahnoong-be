import { FASTIFY_URL } from '../../../../helper/constant.js';
import { deleteRecord, getAllRecords } from './records.service.js';

/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 */
export async function deleteRecordHandler(req, reply) {
    try {
        const { id } = req.params;
        await deleteRecord(id);
        reply.send({ message: 'Record deleted' });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function fetchAllRecordsHandler(req, reply) {
    try {
        const data = await getAllRecords();
        for (let i = 0; i < data.length; i++) {
            data[i].url = `${FASTIFY_URL}/files/${data[i].username}/${data[i].filename}`;
        }
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
    
}