import uWS from 'uWebSockets.js';
import { connect, forwardToRaspi } from '../connection/raspberrypi-ws.js';
import { control } from '../../utils/objects.js';
import { checkApprovedReservationNow } from '../../fastify-service/features/reservation/public/reservation.service.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../helper/constant.js';

export let timestamp = 0;

/**
 * 
 * @param {uWS.TemplatedApp} app 
 * @param {{control: WebSocket | null, stream: WebSocket | null}} raspiSockets 
 */
export function registerControllerEndpoint(app, raspiSockets){
    app.ws('/control', {
        upgrade: (res, req, context) => {
            const token = req.getHeader('cookie').replace('refreshToken=', '');
            if (!token) {
                res.writeStatus('401 Unauthorized').end(
                    JSON.stringify({
                        error: 'Unauthorized',
                    }),
                    true
                );
                return;
            }
            let isAllowed = false;
            const user = jwt.verify(token, JWT_SECRET); // Throws if invalid
            checkApprovedReservationNow(user.id)
                .then((res) => {
                    isAllowed = res;    
                })
                .catch(err => {
                    console.error(err);
                    isAllowed = false;
                    res.writeStatus('401 Unauthorized')
                        .end(
                            JSON.stringify({
                                error: 'Unauthorized',
                            }),
                            true
                        );
                });

            if (!isAllowed && user.role !== 'admin') {
                console.log(`403 User ${user.username} tried to connect outside allowed time`);
                res.writeStatus('403 Forbidden').end();
                return;
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
            control.add(ws.user.username);
            if (!raspiSockets.control){
                console.log('[control] starting control.');
                connect(raspiSockets, 'control', 'ws', (msg) =>{});
            }
        },

        close: (ws) => {
            control.delete(ws.user.username);
            console.log('[control] client disconnected. Total:', control.size);
            if (raspiSockets.control){
                console.log('[control] closing Raspi control WS');
                raspiSockets.control.close();
            }
        },
        message: (ws, message, isBinary) => {
            if (!isBinary){
                try{
                    const command = JSON.parse(Buffer.from(message).toString());
                    forwardToRaspi(raspiSockets, 'control', JSON.stringify(command));
                    console.log('[control] Sent command:', command.dir);
                } catch (err) {
                    console.error('Invalid JSON command:', err);
                }
            }
        }

    });
}


/**
 * 
 * @param {uWS.TemplatedApp} app 
 * @param {{control: WebSocket | null, stream: WebSocket | null}} raspiSockets 
 * @param {import('child_process').ChildProcessWithoutNullStreams } ffmpeg
 * @param {Set} clients 
 */
export function registerControllerStreamEndpoint(app, raspiSockets, ffmpeg, clients = new Set()) {
    app.ws('/view-control', {
        open: (ws) => {
            clients.add(ws);
            if (!raspiSockets.stream){
                console.log('[stream] starting stream. Total:', clients.size);
                connect(raspiSockets, 'stream', 'ws-blob', (msg) => {
                    timestamp = msg.readBigUInt64LE(0);
                    const imageBytes = msg.slice(8);
                    ffmpeg.stdin.write(imageBytes);
                });
            }
        },

        close: (ws) => {
            clients.delete(ws);
            console.log('[stream] frontend disconnected. Total:', clients.size);
            if (clients.size === 0 && raspiSockets.stream){
                console.log('[stream] closing Raspi control WS');
                raspiSockets.stream.close();
                raspiSockets.stream = null;
            }
        }
    });
}