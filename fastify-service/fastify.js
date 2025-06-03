import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';

// import { Server } from 'socket.io';

// imports
import authenticate from './middleware/authenticate.js';
import requireAdmin from './middleware/requireAdmin.js';
import corsOptions from './config/cors.js';

// HTTP routes imports
import webRoutes from './routes/web.js';

async function buildApp() {
  const TELESCOPE_LATITUDE = parseFloat(process.env.TELESCOPE_LATITUDE);
  const TELESCOPE_LONGITUDE = parseFloat(process.env.TELESCOPE_LONGITUDE);

  const PORT = process.env.SERVER_PORT || 9004;
  const HOST = process.env.SERVER_HOST || '0.0.0.0';

  const app = Fastify();

  // --- Plugin Registration ---
  app.register(FastifyJwt, { secret: process.env.JWT_SECRET || 'your_strong_secret' });
  app.register(FastifyCors, corsOptions);
  
  // --- Middleware Decorate ---
  app.decorate('authenticate', authenticate);
  app.decorate('requireAdmin', requireAdmin);
  
  // --- Route registration ---
  await webRoutes(app);
  
  // --- Server start ---
  const server = await app.listen({ port: PORT, host: HOST });
  
  // --- Feature registration Websocket ---
  // await registerTelescopeStream(io); // route: /stream

  console.log(`✅ Fastify listening on http://${HOST}:${PORT}`);
  console.log(`telescope latitude: ${TELESCOPE_LATITUDE}, longitude: ${TELESCOPE_LONGITUDE}`);

  return app;
}

await buildApp();