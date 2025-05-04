import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { Server } from 'socket.io';

import registerTelescopeStream from './src/features/telescope-stream/index.js';
import registerStellariumApi from './src/features/api/Stellarium/index.js';
import registerNasaFeature from './src/features/api/NASA/index.js';


async function buildApp() {
  const TELESCOPE_LATITUDE= parseFloat(process.env.TELESCOPE_LATITUDE);
  const TELESCOPE_LONGITUDE= parseFloat(process.env.TELESCOPE_LONGITUDE);

  const app = Fastify();
  app.register(fastifyCors, { origin: '*' });
  //Add hello world on root
  app.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
  
  // --- Feature registration ---
  await registerStellariumApi(app); // route: /api/stellarium/object
  await registerNasaFeature(app); // route: /api/nasa
  
  const server = await app.listen({ port: 9004, host: '0.0.0.0' });
  const io = new Server(app.server, {
    cors: { origin: '*' },
  });
  
  // --- Feature registration Websocket ---
  await registerTelescopeStream(io); // route: /stream

  console.log(`Server listening on ${server}`);
  console.log(`telescope latitude: ${TELESCOPE_LATITUDE}, longitude: ${TELESCOPE_LONGITUDE}`);

  return { app, io };
}

await buildApp();