import { startWebSocketServer } from './uws-service.js';
import { startFFmpeg } from '../utils/ffmpeg.js';

export let lastFrame = null;

export default function startUWebSocketServer() {
  const HOST = process.env.WS_HOST || '0.0.0.0';
  const PORT = process.env.WS_PORT || 9005; 
  
  const { streamBroadcast, controlBroadcast } = startWebSocketServer(HOST, PORT);
  
  startFFmpeg( 
    (chunk) => {
      lastFrame = chunk;
      controlBroadcast(chunk);
    }, (chunk) => {
      streamBroadcast(chunk)
    });
}