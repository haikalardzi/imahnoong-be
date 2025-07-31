// import UWS from 'uWebSockets.js';
import { registerControllerEndpoint, registerControllerStreamEndpoint, timestamp } from './service/control.js';
import { startFFmpeg } from '../utils/ffmpeg.js';
import { registerViewerEndpoint } from './service/stream.js';
import { WebSocketServer } from 'ws';

export let lastFrame = null;
export function startWebSocketServer (){
    const HOST = process.env.WS_HOST || 'localhost';
    const PORT = process.env.WS_PORT || 9005;

    const pathnames = [
        '/control',
        '/stream',
        '/view-control'
    ];

    const app = new WebSocketServer({host: HOST, port: PORT}, () => {
        console.log(`✅ WebSocket listening on ws://${HOST}:${PORT}`);
    });

    const controlClients = new Set();
    const streamClients = new Set();

    const ffmpeg = startFFmpeg();

    const raspiSockets = {
        control: null,
        stream: null
    }

    registerControllerEndpoint(app, raspiSockets, pathnames);
    registerControllerStreamEndpoint(app, raspiSockets, ffmpeg, controlClients, pathnames);
    registerViewerEndpoint(app, streamClients, pathnames);

    ffmpeg.stdio[3]?.on('data', (data) => {
        lastFrame = data;
        const timeBuffer = Buffer.alloc(8);
        timeBuffer.writeBigUInt64BE(timestamp);
        const now = new Date();
        // console.log(`stream: ${now - parseInt(timestamp)} ms`);
        const payload = Buffer.concat([timeBuffer, data]);
        for (const client of controlClients) {
            if (!client.closed) client.send(payload, true);
        }
    });

    ffmpeg.stdio[4]?.on('data', (data) => {
        for (const client of streamClients) {
            if (!client.closed) client.send(data, true);
        }
    });
    
}


// export function startWebSocketServer(){
//   app.listen(HOST, PORT, (token) => {
//       if (token) {
//           console.log(`✅ WebSocket listening on ws://${HOST}:${PORT}`);
//       } else {
//           console.error('❌ WebSocket server failed to start.');
//       }
//   });
// }