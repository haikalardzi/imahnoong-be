import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';

// import { Server } from 'socket.io';

// imports
import authenticate from './middleware/authenticate.js';
import corsOptions from './config/cors.js';

// HTTP routes imports
import webRoutes from './routes/web.js';

// Websocket imports
import registerTelescopeStream from './features/telescope-stream/index.js';

async function buildApp() {
  const TELESCOPE_LATITUDE = parseFloat(process.env.TELESCOPE_LATITUDE);
  const TELESCOPE_LONGITUDE = parseFloat(process.env.TELESCOPE_LONGITUDE);

  const app = Fastify();

  // --- Plugin Registration ---
  app.register(FastifyJwt, { secret: process.env.JWT_SECRET || 'your_strong_secret' });
  app.register(FastifyCors, corsOptions);
  
  // --- Middleware Decorate ---
  app.decorate('authenticate', authenticate);
  
  // --- Route registration ---
  await webRoutes(app);
  
  // --- Server start ---
  const server = await app.listen({ port: 9004, host: '0.0.0.0' });
  
  // --- Feature registration Websocket ---
  // await registerTelescopeStream(io); // route: /stream

  console.log(`Server listening on ${server}`);
  console.log(`telescope latitude: ${TELESCOPE_LATITUDE}, longitude: ${TELESCOPE_LONGITUDE}`);

  return app;
}

await buildApp();