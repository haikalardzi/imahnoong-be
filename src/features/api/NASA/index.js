import nasaRoutes from './nasa.routes.js';

export default async function registerNasaFeature(fastify) {
  await fastify.register(nasaRoutes, { prefix: '/api' });
}