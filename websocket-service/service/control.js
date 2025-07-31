// import uWS from 'uWebSockets.js';
import { connect, forwardToRaspi } from '../connection/raspberrypi-ws.js';
import { control } from '../../utils/objects.js';
import { checkApprovedReservationNow } from '../../fastify-service/features/reservation/public/reservation.service.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../helper/constant.js';
import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'cookie';

export let timestamp = 0;

/**
 * 
 * @param {WebSocketServer} app 
 * @param {{control: WebSocket | null, stream: WebSocket | null}} raspiSockets
 * @param {string[]} pathnames  
 */
export function registerControllerEndpoint(app, raspiSockets, pathnames){
    app.on('connection', async (ws, req) => {
        const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

        if (!pathnames.includes(pathname)) ws.close(4000, 'Not found');
        if (pathname !== '/control') return;
        try {
            const token = req.headers['sec-websocket-protocol'];

            if (control.size > 1) {
                ws.close(4000, 'only one at a time');
                return;
            }

            if (!token){
                ws.close(4001, 'Unauthorized');
                return;
            }

            const user = jwt.verify(token, JWT_SECRET);
            ws.user = user;
            if (user.role !== 'admin') {
                const allowed = await checkApprovedReservationNow(user.id);
                if (!allowed) {
                    console.log(`403 User ${user.username} tried to connect outside allowed time`);
                    ws.close(4003, 'Forbidden');
                    return;
                } else {
                    console.log(`200 User ${user.username} granted`);
                }
            }

            control.add(user.username);

            if (!raspiSockets.control) {
                console.log('[control] starting control.');
                connect(raspiSockets, 'control', 'ws', (msg) => {
                    const buffer = msg;
                    const text = new TextDecoder().decode(buffer);
                    const response = JSON.parse(text); // First 8 bytes
                    const now = new Date();
                    response.servertime = now.getTime();
                    ws.send(JSON.stringify(response));
                });
            }

            ws.on('message', (message, isBinary) => {
                if (!isBinary){
                    try {
                        const command = JSON.parse(message.toString());
                        const ts = new Date();
                        // console.log(`cmd: ${ts - command.timestamp} ms`);
                        forwardToRaspi(raspiSockets, 'control', JSON.stringify(command));
                        console.log('[control] Sent command:', command.dir);
                    } catch (err){
                        ws.send(400);
                        console.log('Invalid JSON command:', err);
                    }
                }
            });
            ws.on('close', () => {
                console.log('[control] client disconnected. Total:', control.size);
                control.delete(user.username);
                if (raspiSockets.control) {
                    console.log('[control] closing Raspi control WS');
                    raspiSockets.control.close();
                    raspiSockets.control = null;
                }
            });
        } catch(err) {
            console.error(err);
            ws.close(1011, 'Internal server error');
        }
    });
}

    // app.ws('/control', {
    //     upgrade: (res, req, context) => {
    //         try{

    //             const token = req.getHeader('cookie').replace('refreshToken=', '');
    //             if (!token) {
    //                 res.writeStatus('401 Unauthorized').end(
    //                     JSON.stringify({
    //                         error: 'Unauthorized',
    //                     }),
    //                     true
    //                 );
    //                 return;
    //             }
    //             const user = jwt.verify(token, JWT_SECRET); // Throws if invalid
    //             if (user.role !== 'admin'){
    //                 checkApprovedReservationNow(user.id).then((res) => {
    //                     if (!res) {
    //                         console.log(`403 User ${user.username} tried to connect outside allowed time`);
    //                         res.writeStatus('403 Forbidden').end();
    //                         return;
    //                     } else {
    //                         console.log(`200 User ${user.username} granted`);
    //                     }
    //                 })
    //                 .catch(err => {
    //                     console.error(err);
    //                     res.writeStatus('401 Unauthorized')
    //                         .end(
    //                             JSON.stringify({
    //                                 error: 'Unauthorized',
    //                             }),
    //                             true
    //                         );
    //                     return;
    //                 });
    //             }
    
    //             res.upgrade(
    //                 { user }, // pass user into ws object
    //                 req.getHeader('sec-websocket-key'),
    //                 req.getHeader('sec-websocket-protocol'),
    //                 req.getHeader('sec-websocket-extensions'),
    //                 context
    //             );
    //         } catch (err) {
    //             console.error(err);
    //             res.writeStatus('500 oops! something went wrong')
    //                 .end(
    //                     JSON.stringify({
    //                         error: '500 oops! something went wrong',
    //                     }),
    //                     true
    //                 );
    //         }
                
    //     },
    //     open: (ws) => {
    //         control.add(ws.user.username);
    //         if (!raspiSockets.control){
    //             console.log('[control] starting control.');
    //             connect(raspiSockets, 'control', 'ws', (msg) =>{});
    //         }
    //     },

    //     close: (ws) => {
    //         control.delete(ws.user.username);
    //         console.log('[control] client disconnected. Total:', control.size);
    //         if (raspiSockets.control){
    //             console.log('[control] closing Raspi control WS');
    //             raspiSockets.control.close();
    //         }
    //     },
    //     message: (ws, message, isBinary) => {
    //         if (!isBinary){
    //             try{
    //                 const command = JSON.parse(Buffer.from(message).toString());
    //                 forwardToRaspi(raspiSockets, 'control', JSON.stringify(command));
    //                 console.log('[control] Sent command:', command.dir);
    //             } catch (err) {
    //                 console.error('Invalid JSON command:', err);
    //             }
    //         }
    //     }

    // });


/**
 * 
 * @param {WebSocketServer} app 
 * @param {{control: WebSocket | null, stream: WebSocket | null}} raspiSockets 
 * @param {import('child_process').ChildProcessWithoutNullStreams } ffmpeg
 * @param {Set} clients 
 * @param {string[]} pathnames 
 */
export function registerControllerStreamEndpoint(app, raspiSockets, ffmpeg, clients = new Set(), pathnames) {
    app.on('connection', (ws, req) => {
        const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
        if (!pathnames.includes(pathname)) ws.close(4000, 'Not found');
        if (pathname !== '/view-control') return;
        if (clients.size > 1) {
            ws.close(4000, 'only one at a time');
            return;
        }
        console.log("[view-stream]: connection success");

        clients.add(ws);

        if (!raspiSockets.stream) {
            console.log('[stream] starting stream. Total:', clients.size);
            connect(raspiSockets, 'stream', 'ws-blob', (msg) => {
                timestamp = msg.readBigUInt64LE(0);
                const imageBytes = msg.slice(8);
                ffmpeg.stdin.write(imageBytes);
                // if (!test){
                //     raspiSockets.stream.pause();
                //     ffmpeg.stdin.once('drain', () => {
                //         raspiSockets.stream.resume();
                //     });
                // }
            });
        }

        ws.on('close', () => {
            clients.delete(ws);
            console.log('[stream] frontend disconnected. Total:', clients.size);
            if (clients.size === 0 && raspiSockets.stream) {
                console.log('[stream] closing Raspi control WS');
                raspiSockets.stream.close();
                raspiSockets.stream = null;
            }
        });

    });

}
// app.ws('/view-control', {
//     open: (ws) => {
//         clients.add(ws);
//         if (!raspiSockets.stream){
//             console.log('[stream] starting stream. Total:', clients.size);
//             connect(raspiSockets, 'stream', 'ws-blob', (msg) => {
//                 timestamp = msg.readBigUInt64LE(0);
//                 const imageBytes = msg.slice(8);
//                 ffmpeg.stdin.write(imageBytes);
//             });
//         }
//     },

//     close: (ws) => {
//         clients.delete(ws);
//         console.log('[stream] frontend disconnected. Total:', clients.size);
//         if (clients.size === 0 && raspiSockets.stream){
//             console.log('[stream] closing Raspi control WS');
//             raspiSockets.stream.close();
//             raspiSockets.stream = null;
//         }
//     }
// });