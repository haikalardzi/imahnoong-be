// ws-stream.js
import uWS from 'uWebSockets.js'
import { viewer } from '../../utils/viewer.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../helper/constant.js';
function parseAddress(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length === 4) {
    // IPv4
    return bytes.join('.');
  } else if (bytes.length === 16) {
    // IPv6
    const parts = [];
    for (let i = 0; i < 16; i += 2) {
      parts.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
    }
    return parts.join(':');
  } else {
    return 'Unknown IP format';
  }
}

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
        user = jwt.verify(token, JWT_SECRET); // Throws if invalid
      }
      res.upgrade(
        { user }, // pass user into ws object
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context
      );
    },
    open: (ws) => {
      console.log(parseAddress(ws.getRemoteAddress()));
      viewer.add(ws.user.username);
      clients.add(ws);
      console.log(ws.user.username + ' connected to /stream');
      console.log('Number of clients: ' + viewer.size);
      ws.subscribe('stream');
    },
    close: (ws) => {
      console.log( ws.user.username + ' disconnected from /stream');
      console.log('Number of clients: ' + viewer.size);
      viewer.delete(ws.user.username);
      clients.delete(ws);
    }
  });
  /**
   * 
   * @param {Buffer} data 
   */
  const broadcast = (data) => {
    const timestamp = Date.now(); // Server timestamp in ms
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigUInt64BE(BigInt(timestamp)); // 8 bytes for timestamp
    const payload = Buffer.concat([timeBuffer, data]); // timestamp + image data
    for (const client of clients) {
      if (!client.closed) {
        client.send(payload, true); // send as binary
      }
    }
  }
  return broadcast;
}
