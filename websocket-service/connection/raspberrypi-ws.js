import WebSocket from 'ws';
import { RASPI_HOST, RASPI_PORT } from '../../utils/objects.js';

/**
 * 
 * @param {{control: WebSocket | null, stream: WebSocket | null}} raspiSockets 
 * @param {string} type 
 * @param {string} url 
 * @param {(msg: Buffer) => void} onMessage 
 */
export function connect(raspiSockets, type, url, onMessage){
    const ws = new WebSocket(`ws://${RASPI_HOST}:${RASPI_PORT}/${url}`);

    ws.on('open', () => console.log(`[raspi:${type}] connected`));
    ws.on('close', () => {
        console.log(`[raspi:${type}] connection closed`);
        raspiSockets[type] = null;
    });

    ws.on('error', (err) => {
        console.error(`[raspi:${type}] error: ${err.message}`);
    });

    ws.on('message', onMessage);
    raspiSockets[type] = ws;
}

export function forwardToRaspi(raspiSockets, type, message){
    const target = raspiSockets[type];
    if (target && target.readyState === WebSocket.OPEN) {
        target.send(message);
    } else {
        console.log(`[raspi:${type}] not connected`);
    }
}