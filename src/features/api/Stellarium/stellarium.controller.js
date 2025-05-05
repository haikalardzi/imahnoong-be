import { getObjectDataByName } from './stellarium.service.js';

export async function stellariumMetadataHandler(request, reply) {
  const { name } = request.query;

    if (!name) {
        return reply.status(400).send({ error: 'Object name is required' });
    }

    try {
        const metadata = await getObjectDataByName(name);
        return reply.send(metadata);
    } catch (err) {
        return reply.status(500).send({ error: err.message });
    }
}