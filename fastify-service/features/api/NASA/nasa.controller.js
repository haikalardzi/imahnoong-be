import { getNasaObjectMetadata } from './nasa.service.js';

export async function nasaMetadataHandler(request, response) {
  const { name } = request.query;

  if (!name) {
    return response.status(400).send({ error: 'Object name is required' });
  }

  try {
    const data = await getNasaObjectMetadata(name);
    return response.send(data);
  } catch (err) {
    return response.status(500).send({ error: err.message });
  }
}