import { getNasaObjectMetadata } from './nasa.service.js';

export async function nasaMetadataHandler(request, reply) {
  const { name } = request.query;

  if (!name) {
    return reply.status(400).send({ error: 'Object name is required' });
  }

  try {
    const data = await getNasaObjectMetadata(name);
    return reply.send(data);
  } catch (err) {
    return reply.status(500).send({ error: err.message });
  }
}