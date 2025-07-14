import { saveMetadata, saveFile, getRecordsByUser, getLast6Records, getRecord } from './records.service.js';
import { v4 as uuidv4 } from 'uuid';
import { FASTIFY_URL } from '../../../../helper/constant.js';
import { lastFrame } from '../../../../websocket-service/uwebsocket.js';

/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 */
export async function saveRecordHandler(req, reply) {
    try{
        const safeCopy = Buffer.from(lastFrame);
        if (!(safeCopy[0] === 0xff && safeCopy[1] === 0xd8)) return reply.code(400).send({ error: 'Invalid JPEG file' });
        const metadata = req.body;
        const filename = uuidv4() + '.jpg';
        const username = req.user.username.replace(/[^a-zA-Z0-9_-]/g, '');

        if (!safeCopy) return reply.code(400).send({ error: 'Camera is not connected' });
        
        const result = await saveMetadata(username, filename, metadata);

        if (!result) return reply.code(500).send({ error: 'Failed to save metadata' });
        
        await saveFile(username, safeCopy, filename);
        reply.send({
            status: 'ok',
            filename: filename,
            path: `/files/${username}/${filename}`,
        });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function fetchRecordsByUser(req, reply) {
    try{
        const data = await getRecordsByUser(req.user.username);
        for (let i = 0; i < data.length; i++) {
            data[i].url = `${FASTIFY_URL}/files/${data[i].username}/${data[i].filename}`;   
        }
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function fetchLatestRecords(req, reply) {
    try{
        const data = await getLast6Records();
        for (let i = 0; i < data.length; i++) {
            data[i].url = `${FASTIFY_URL}/files/${data[i].username}/${data[i].filename}`;   
        }
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}

export async function fetchRecord(req, reply) {
    try{
        const data = await getRecord(req.params.id);
        data.url = `${FASTIFY_URL}/files/${data.username}/${data.filename}`;
        reply.send(data);
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}