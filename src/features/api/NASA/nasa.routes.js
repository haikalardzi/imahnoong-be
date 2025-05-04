import { getNasaMetadataHandler } from './nasa.controller.js';

export default async function nasaRoutes(fastify, opts) {
  fastify.get('/nasa/object', getNasaMetadataHandler);
}