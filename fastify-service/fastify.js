import fs from 'fs';

import Fastify from 'fastify';
import FastifyJwt from '@fastify/jwt';
import FastifyCors from '@fastify/cors';
import FastifyStatic from '@fastify/static';
import FastifyRateLimit from '@fastify/rate-limit';
import FastifyMultipart from '@fastify/multipart';
import FastifyCookie from '@fastify/cookie';
// import { Server } from 'socket.io';

// imports
import authenticate from './middleware/authenticate.js';
import requireAdmin from './middleware/requireAdmin.js';
// HTTP routes imports
import webRoutes from './routes/web.js';
import { FE_URL, JWT_SECRET, fastifyUploadRoot } from '../helper/constant.js';

export default function startFastifyServer() {
  const TELESCOPE_LATITUDE = parseFloat(process.env.TELESCOPE_LATITUDE);
  const TELESCOPE_LONGITUDE = parseFloat(process.env.TELESCOPE_LONGITUDE);

  const PORT = process.env.SERVER_PORT || 9004;
  const HOST = process.env.SERVER_HOST || '0.0.0.0';

  const app = Fastify({
    // https: {
    //   key: fs.readFileSync(process.env.SSL_KEY),
    //   cert: fs.readFileSync(process.env.SSL_CERT)
    // },
    logger: {
      transport: {
        target: '@fastify/one-line-logger'
      }
    }
  });
  // --- Plugin Registration ---
  app.register(FastifyCookie);
  app.register(FastifyJwt, { 
    secret: JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false
    }
  });
  app.register(FastifyCors, {
    origin: ['http://localhost:5173', FE_URL], // Your React app URLs
    credentials: true, // ✅ This is crucial for cookies!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });  
  app.register(FastifyMultipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 10 * 1024 * 1024,
      fields: 10,
      fileSize: 5 * 1024 * 1024,
      files: 1,
      headerPairs: 2000
    },
    attachFieldsToBody: true,
  });

  app.register(FastifyStatic, {
    root: fastifyUploadRoot, // ✅ absolute path to ./public
    prefix: '/files/',                   // URL prefix
  });

  app.register(FastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  
  // --- Middleware Decorate ---
  app.decorate('authenticate', authenticate);
  app.decorate('requireAdmin', requireAdmin);
  
  // --- Route registration ---
  webRoutes(app);
  
  // --- Global Timeouts ---
  app.server.timeout = 30000;
  app.server.keepAliveTimeout = 5000;
  app.server.headersTimeout = 6000;
  
  // --- Server start ---
  app.listen({ port: PORT, host: HOST })
    .then((server) => console.log(`✅ Fastify listening on ${server}`))
    .catch((err) => console.error(err));
  
  console.log(`telescope latitude: ${TELESCOPE_LATITUDE}, longitude: ${TELESCOPE_LONGITUDE}`);

  return app;
}