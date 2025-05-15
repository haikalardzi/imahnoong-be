// ws-stream.js
export function registerStreamEndpoint(app, clients = new Set()) {
  app.ws('/stream', {
    open: (ws) => {
      console.log('Client connected to /stream');
      clients.add(ws);
      ws.subscribe('stream');
    },
    close: (ws) => {
      console.log('Client disconnected from /stream');
      clients.delete(ws);
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
