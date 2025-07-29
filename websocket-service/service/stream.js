import { viewer } from '../../utils/objects.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../helper/constant.js';
import { WebSocketServer } from 'ws';
import { parse } from 'cookie';
/**
 * 
 * @param {WebSocketServer} app 
 * @param {Set} clients 
 * @param {string[]} pathnames 
 */
export function registerViewerEndpoint(app, clients = new Set(), pathnames) {
    app.on('connection', (ws, req) => {
        const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

        if (!pathnames.includes(pathname)) ws.close(4000, 'Not found');
        if (pathname !== '/stream') return;

        let user = {
            username: 'public',
            role: 'user'
        };

        ws.user = user;

        try {
            const cookies = parse(req.headers.cookie || '');
            const token = cookies.refreshToken;

            if (token) {
                user = jwt.verify(token, JWT_SECRET);
            }

            ws.user = user;
        } catch (err) {
            console.error('[stream] invalid token:', err.message);
            // Still allow public viewer access — fallback user info already set
        }

        clients.add(ws);
        viewer.add(ws.user.username);
        console.log('[stream] client connected. Total:', clients.size);

        ws.on('close', () => {
            clients.delete(ws);
            viewer.delete(ws.user.username);
            console.log('[stream] client disconnected. Total:', clients.size);
        });
    });
}
// app.ws('/stream', {
//     compression: 0,
//     maxPayloadLength: 16 * 1024 * 1024,
//     idleTimeout: 60,
//     upgrade: (res, req, context) => {
//         const token = req.getHeader('cookie').replace('refreshToken=', '');
//         console.log(token);
//         let user = {
//             username: 'public',
//             role: 'user'
//         };
//         if (token) {
//             user = jwt.verify(token, JWT_SECRET); // Throws if invalid
//         }
//         res.upgrade(
//             { user }, // pass user into ws object
//             req.getHeader('sec-websocket-key'),
//             req.getHeader('sec-websocket-protocol'),
//             req.getHeader('sec-websocket-extensions'),
//             context
//         );
//     },
//     open: (ws) => {
//         clients.add(ws);
//         viewer.add(ws.user.username);
//         console.log('[stream] client connected. Total:', clients.size);
//     },
//     close: (ws) => {
//         viewer.delete(ws.user.username);
//         clients.delete(ws);
//         console.log('[stream] client disconnected. Total:', clients.size);
//     }
// });
