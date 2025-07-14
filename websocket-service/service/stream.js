import uWS from 'uWebSockets.js';
import { viewer } from '../../utils/objects.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../helper/constant.js';
/**
 * 
 * @param {uWS.TemplatedApp} app 
 * @param {{control: WebSocket | null, stream: WebSocket | null}} raspiSockets 
 * @param {import('child_process').ChildProcessWithoutNullStreams } ffmpeg
 * @param {Set} clients 
 */
export function registerViewerEndpoint(app, raspiSockets, ffmpeg, clients = new Set()) {
    app.ws('/stream', {
        compression: 0,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 60,
        upgrade: (res, req, context) => {
            const token = req.getHeader('cookie').replace('refreshToken=', '');
            console.log(token);
            let user = {
                username: 'public',
                role: 'user'
            };
            if (token) {
                user = jwt.verify(token, JWT_SECRET); // Throws if invalid
            }
            res.upgrade(
                { user }, // pass user into ws object
                req.getHeader('sec-websocket-key'),
                req.getHeader('sec-websocket-protocol'),
                req.getHeader('sec-websocket-extensions'),
                context
            );
        },
        open: (ws) => {
            clients.add(ws);
            viewer.add(ws.user.username);
            console.log('[stream] client connected. Total:', clients.size);
        },
        close: (ws) => {
            viewer.delete(ws.user.username);
            clients.delete(ws);
            console.log('[stream] client disconnected. Total:', clients.size);
        }
    });
}
