import uWS from 'uWebSockets.js';

const clients = new Set();

export function startWebSocketServer(host= '0.0.0.0', port = 9005) {
  const app = uWS.App().ws('/*', {
    open: (ws) => {
      console.log('Client connected');
      clients.add(ws);
      ws.subscribe('stream');
    },
    close: (ws) => {
      console.log('Client disconnected');
      clients.delete(ws);
    }
  });

  app.listen(host, port, (token) => {
    if (token) {
      console.log(`✅ uWS video stream running at ws://localhost:${port}`);
    } else {
      console.error('❌ Failed to start uWS server');
    }
  });

  return {
    broadcast: (data) => {
      for (const client of clients) {
        if (!client.closed) {
          client.send(data, true); // Send as binary
        }
      }
    }
  };
}
