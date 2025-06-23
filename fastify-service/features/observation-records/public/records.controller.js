import { saveMetadata, saveFile, getRecordsByUser, getLast6Records, getRecord } from './records.service.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FASTIFY_URL } from '../../../../helper/constant.js';

/**
 * 
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} reply 
 */
export async function saveRecordHandler(req, reply) {
    try{
        const file = req.body.file;
        const formData = await req.formData();
        const metadata = JSON.parse(formData.get('metadata'));

        if (!file) return reply.code(400).send({ error: 'Missing file' });
        
        const username = req.user.username.replace(/[^a-zA-Z0-9_-]/g, '');

        const ext = path.extname(file.filename); // e.g. ".jpg", ".png", etc.
        const filename = `${uuidv4()}${ext}`; 
        const result = await saveMetadata(username, filename, metadata);

        if (!result) return reply.code(500).send({ error: 'Failed to save metadata' });
        
        await saveFile(username, file, filename);
        reply.send({
            status: 'ok',
            filename,
            path: `/files/${req.user.username}/${filename}`,
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