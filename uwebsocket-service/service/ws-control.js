// ws-control.js

export function registerControlEndpoint(app, onCommand) {
  app.ws('/control', {
    open: (ws) => {
      console.log('Client connected to /control');
    },
    message: (ws, message, isBinary) => {
      if (!isBinary) {
        try {
          const command = JSON.parse(Buffer.from(message).toString());
          console.log('Received command:', command.dir);
          if (onCommand) onCommand(command);
        } catch (err) {
          console.error('Invalid JSON command:', err);
        }
      }
    },
    close: (ws) => {
      console.log('Client disconnected from /control');
    }
  });
}
