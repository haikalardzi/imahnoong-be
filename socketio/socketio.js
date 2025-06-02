// server/socketio.js
import Fastify from 'fastify';
import { Server } from 'socket.io';
import { startFFmpeg } from '../ffmpeg.js';

const PORT = process.env.SOCKETIO_PORT || 9006;
const HOST = process.env.SOCKETIO_HOST || '0.0.0.0';

const app = Fastify();
const server = await app.listen({ port: PORT, host: HOST });

console.log('✅ Socket.io server running at http://localhost:9006');

// ---- Socket.IO Instantiation ----

// 1. Video stream namespace
const ioStream = new Server(app.server, {
  path: '/socketio/stream'
});

// 2. Control command namespace
const ioControl = new Server(app.server, {
  path: '/socketio/control'
});

// ---- VIDEO STREAM ----
let streamSockets = [];

ioStream.on('connection', (socket) => {
  console.log('🟢 Client connected to /socketio/stream');
  streamSockets.push(socket);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected from stream');
    streamSockets = streamSockets.filter(s => s !== socket);
  });
});

// FFmpeg pushes chunks to connected clients
startFFmpeg((chunk) => {
  streamSockets.forEach(socket => {
    if (socket.connected) socket.emit('video-frame', chunk);
  });
});

// ---- CONTROL CHANNEL ----
ioControl.on('connection', (socket) => {
  console.log('🟢 Client connected to /socketio/control');

  socket.on('control-command', (data) => {
    const receivedAt = Date.now();
    const delay = receivedAt - data.timestamp;

    console.log(`📡 Received command: ${data.dir}`);
    console.log(`⏱️  Client timestamp: ${data.timestamp}`);
    console.log(`⏱️  Server timestamp: ${receivedAt}`);
    console.log(`⏳ Time delta: ${delay}ms`);

    // TODO: Call telescope control logic here
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected from control');
  });
});
