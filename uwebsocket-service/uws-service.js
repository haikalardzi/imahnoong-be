// uws-service.js
import uWS from 'uWebSockets.js';
import WebSocket from 'ws';
import { registerStreamEndpoint } from './service/ws-stream.js';
import { registerControlEndpoint } from './service/ws-control.js';

const viewer = new Set();
const control = new Set();

/**
 * @param {string} host 
 * @param {number} port 
 * @returns
 */
export function startWebSocketServer(host, port) {
  const app = uWS.App();
  const RASPI_HOST = process.env.RASP_PI_HOST || "localhost";
  const RASPI_PORT = process.env.RASP_PI_PORT || "8000";
  const ws = new WebSocket(`ws://${RASPI_HOST}:${RASPI_PORT}/ws`);

  const { broadcast: streamBroadcast } = registerStreamEndpoint(app, viewer, false);
  const { broadcast: controlBroadcast } = registerStreamEndpoint(app, control, true);

  registerControlEndpoint(app, (command) => {
    // Handle command logic here
    const time = Date.now();
    const interval = time - command.timestamp;
    console.log('Interval: ' + interval / 1000 + 's');
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(command));
      console.log(`sent command to websocket control address`)
    } else {
      console.warn('WebSocket is not open. Command not sent.');
    }
  });
  ws.on('open', () => {
    // setup functions
  });
  ws.on('close', () => {
    // TODO going to another page => call ws.close() but AFTER the send below is sent
    // exit command to shutdown indigo client
    // ws.send(JSON.stringify({
    //   type: 'command',
    //   dir: 'exit',
    //   timestamp: Date.now(),
    // }))
  });
  ws.on('error', (err) => {
    console.error('Failed to send command:', err);
  });
  app.listen(host, port, (token) => {
    if (token) {
      console.log(`✅ uWS server running at ws://${host}:${port}`);
    } else {
      console.error('❌ Failed to start uWS server');
    }
  });

  return { streamBroadcast, controlBroadcast };
}
