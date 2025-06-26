// uws-service.js
import uWS from 'uWebSockets.js';
import { registerStreamEndpoint } from './service/ws-stream.js';
import { registerControlEndpoint } from './service/ws-control.js';

const clients = new Set();

/**
 * @param {string} host 
 * @param {number} port 
 * @returns
 */
export function startWebSocketServer(host, port) {
  const app = uWS.App();

  const broadcast = registerStreamEndpoint(app, clients);

  registerControlEndpoint(app, (command) => {
    // Handle command logic here
    const time = Date.now();
    const interval = time - command.timestamp;
    console.log('Interval: ' + interval / 1000 + 's');
    // TODO: @christo buat command di sini
  });

  app.listen(host, port, (token) => {
    if (token) {
      console.log(`✅ uWS server running at ws://${host}:${port}`);
    } else {
      console.error('❌ Failed to start uWS server');
    }
  });

  return broadcast;
}
