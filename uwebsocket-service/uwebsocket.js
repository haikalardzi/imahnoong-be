import { startWebSocketServer } from './uws-service.js';
import { startFFmpeg } from '../utils/ffmpeg.js';

export let lastFrame = null;

export default function startUWebSocketServer() {
  const HOST = process.env.WS_HOST || '0.0.0.0';
  const PORT = process.env.WS_PORT || 9005; 
  
  const broadcast = startWebSocketServer(HOST, PORT);
  
  const sendChunk = (chunk) => {
    lastFrame = chunk;
    broadcast(chunk);
  }
  startFFmpeg(sendChunk);
}