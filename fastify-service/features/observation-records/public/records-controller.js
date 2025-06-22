import { saveMetadata, saveFile } from './records-service.js';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
        
        const username = req.user.username;
        const ext = path.extname(file.filename); // e.g. ".jpg", ".png", etc.
        const filename = `${uuidv4()}${ext}`; 
        const result = await saveMetadata(username, filename, metadata);
        console.log(result);
        if (!result) return reply.code(500).send({ error: 'Failed to save metadata' });
        
        await saveFile(username, file, filename);
        reply.send({
            status: 'ok',
            filename,
            path: `/uploads/${req.user.username}/${filename}`,
        });
    } catch (err) {
        reply.code(500).send({ error: err.message });
    }
}