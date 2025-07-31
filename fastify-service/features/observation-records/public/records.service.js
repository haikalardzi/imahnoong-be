import fs from 'fs';
import path from 'path';
import db from '../../../config/db.js';
import { fastifyUploadRoot } from '../../../../helper/constant.js';
import sharp from 'sharp';

export async function saveFile(username, file, filename) {
    if (!file) return reply.code(400).send({ error: 'Missing file' });

    const userDir = path.join(fastifyUploadRoot, username);

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    const savePath = path.join(userDir, filename);
    const resized = await sharp(file)
        .resize({
            width: parseInt(process.env.RES_SAVE_W),
            height: parseInt(process.env.RES_SAVE_H),
            fit: 'fill',
        })
        .toBuffer();

    await fs.promises.writeFile(savePath, resized);
}

export async function saveMetadata(username, filename, data) {
    // return 1;
    return await db('observation_records').insert({
        username: username, 
        filename: filename,
        object_name: data.object_name,
        datetime: data.datetime,
        distance: parseFloat(data.distance),
        constellation: data.constellation,
        declination: data.declination,
        right_ascension: data.right_ascension,
        altitude: data.altitude,
        azimuth: data.azimuth,
        description: data.description || null
    });
}

export async function getRecordsByUser(username) {
    return await db('observation_records').where({ username, disable: false }).orderBy('created_at', 'desc');
}

export async function getLast6Records() {
    return await db('observation_records').where({ disable: false }).orderBy('created_at', 'desc').limit(6);
}

export async function getRecord(id) {
    return await db('observation_records').where({ id: id, disable: false }).first();
}