import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import db from '../../../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function saveFile(username, file, filename) {
    if (!file) return reply.code(400).send({ error: 'Missing file' });

    const uploadRoot = path.resolve(__dirname, '../../../uploads');
    const userDir = path.join(uploadRoot, username);

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    const savePath = path.join(userDir, filename);

    await fs.promises.writeFile(savePath, await file.toBuffer());
}

export async function saveMetadata(username, filename, data) {
    return await db('observation_records').insert({
        username: username, 
        filename: filename,
        object_name: data.object_name,
        datetime: data.datetime,
        distance: parseFloat(data.distance),
        constellation: data.constellation,
        declination: data.declination,
        right_ascention: data.right_ascention,
        altitude: data.altitude,
        azimuth: data.azimuth,
        description: data.description || null
    });
}