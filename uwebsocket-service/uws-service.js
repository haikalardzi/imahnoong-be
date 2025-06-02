// uws-service.js
import uWS from 'uWebSockets.js';
import { registerStreamEndpoint } from './service/ws-stream.js';
import { registerControlEndpoint } from './service/ws-control.js';

const PORT = process.env.WS_PORT || 9005;
const HOST = process.env.WS_HOST || '0.0.0.0';
const clients = new Set();

export function startWebSocketServer(host = HOST, port = PORT) {
  const app = uWS.App();

  const { broadcast } = registerStreamEndpoint(app, clients);

  registerControlEndpoint(app, (command) => {
    // Handle command logic here
    const time = Date.now();
    const interval = time - command.timestamp;
    console.log('Interval: ' + interval / 1000 + 's');
    // You can forward this to IoT backend or device controller
  });

  app.listen(host, port, (token) => {
    if (token) {
      console.log(`✅ uWS server running at ws://${host}:${port}`);
    } else {
      console.error('❌ Failed to start uWS server');
    }
  });

  return { broadcast };
}
