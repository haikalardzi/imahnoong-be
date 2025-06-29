import Fastify from 'fastify';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { initmediasoup } from './webrtc.js';
import { setupWebSocket } from './websocket.js';
import { startRTPStream } from './broadcaster.js';

const app = Fastify();
const httpServer = createServer(app.server); // use app.server to keep Fastify request handling

export default async function start (){
  await initmediasoup();
  await startRTPStream();
  const wss = new WebSocketServer({ server: httpServer });
  setupWebSocket(wss); // pass wss instance directly

  await app.listen({ port: 5004, host: '127.0.0.1' });
  console.log('✅ Fastify + WebSocket server running on port 3000');
};
