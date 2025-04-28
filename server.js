import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { Server } from 'socket.io';

import registerTelescopeStream from './src/features/telescope-stream/index.js';
// import { registerStellariumApi } from './features/stellarium-api/index.js';

export async function buildApp() {
  const app = Fastify();
  app.register(fastifyCors, { origin: '*' });
  
  // --- Feature registration ---
  // await registerStellariumApi(app);
  
  const server = await app.listen({ port: 9004, host: '0.0.0.0' });
  const io = new Server(app.server, {
    cors: { origin: '*' },
  });
  
  // --- Feature registration Websocket ---
  await registerTelescopeStream(io);

  return { app, io };
}

buildApp();