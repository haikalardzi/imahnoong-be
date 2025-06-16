import uWS from 'uWebSockets.js'
import { parseIP } from "../helper/byteParser.js";

// ws-stream.js
/**
 * 
 * @param {uWS.TemplatedApp} app 
 * @param {*} clients 
 * @returns 
 */
export function registerStreamEndpoint(app, clients = new Set()) {
  app.ws('/stream', {
    open: (ws) => {
      clients.add(ws);
      console.log('Connected to /stream');
      console.log('Number of clients: ' + clients.size);
      ws.subscribe('stream');
    },
    close: (ws) => {
      clients.delete(ws);
      console.log('Client disconnected from /stream');
      console.log('Number of clients: ' + clients.size);
    }
  });

  return {
    broadcast: (data) => {
      for (const client of clients) {
        if (!client.closed) {
          client.send(data, true); // send as binary
        }
      }
    }
  };
}
