import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { Server } from 'socket.io';
import { spawn } from 'child_process';

const app = Fastify();
app.register(fastifyCors, { origin: '*' });

const server = await app.listen({ port: 9004, host: '0.0.0.0' });
console.log('🚀 Fastify server running on http://localhost:9004');

const io = new Server(app.server, {
  cors: { origin: '*' },
});

let sockets = [];

// Handle socket connections
io.on('connection', socket => {
  console.log('🟢 Client connected');
  sockets.push(socket);

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
    sockets = sockets.filter(s => s !== socket);
  });
});

// Start FFmpeg to capture webcam (or RTSP if needed)
const ffmpeg = spawn('ffmpeg', [
  '-f', 'dshow',
  '-i', 'video=Integrated Camera', //TODO:
  '-vf', 'scale=640:360,fps=15',
  '-f', 'image2pipe',
  '-q:v', '5',
  '-vcodec', 'mjpeg',
  'pipe:1'
]);

ffmpeg.stdout.on('data', (chunk) => {
  sockets.forEach(socket => {
    socket.emit('video-frame', chunk);
  });
});

ffmpeg.stderr.on('data', (data) => {
  // You can log this if debugging FFmpeg
  // console.error(`ffmpeg stderr: ${data}`);
});

// ffmpeg.on('exit', () => {
//   console.log('⚠️ FFmpeg exited');
// });