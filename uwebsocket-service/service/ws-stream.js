// ws-stream.js
import uWS from 'uWebSockets.js'
import { viewer } from '../../utils/viewer.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../helper/constant.js';
/**
 * 
 * @param {uWS.TemplatedApp} app 
 * @param {Set} clients 
 * @returns 
 */
export function registerStreamEndpoint(app, clients = new Set()) {
  app.ws('/stream', {
    upgrade: (res, req, context) => {
      const token = req.getHeader('sec-websocket-protocol');
      let user = {
        username: 'public',
        role: 'user'
      };

      if (token !== "null") {
        console.log(token);
        user = jwt.verify(token, JWT_SECRET); // Throws if invalid
        console.log(user);
      }
      viewer.push(user.username);

      res.upgrade(
        { user }, // pass user into ws object
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context
      );
    },
    open: (ws) => {
      clients.add(ws);
      console.log('Connected to /stream');
      console.log('Number of clients: ' + clients.size);
      ws.subscribe('stream');
    },
    close: (ws) => {
      clients.delete(ws);
      viewer.splice(viewer.indexOf(ws.user.username), 1);
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
