import { Server } from "socket.io";

let sockets = [];

/**
 * io type is fastify
 * @param {Server} io 
 * @returns 
 */
export function setupStreamNamespace(io) {
    const streamNamespace = io.of('/stream');
  
    streamNamespace.on('connection', (socket) => {
        console.log('🟢 Client connected to /stream');
        sockets.push(socket);
  
        socket.on('disconnect', () => {
            console.log('🔴 Client disconnected from /stream');
            sockets = sockets.filter(s => s !== socket);
        });
    });
  
    return {
        emitFrame: (chunk) => {
            streamNamespace.emit('video-frame', chunk);
        }
    };
}