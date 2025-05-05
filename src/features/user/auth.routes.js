import { registerHandler, loginHandler } from './auth.controller.js';

export default async function authRoutes(fastify) {
  fastify.post('/register', registerHandler);
  fastify.post('/login', loginHandler);
}