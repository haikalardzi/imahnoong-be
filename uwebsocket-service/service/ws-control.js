// ws-control.js
import uWS from 'uWebSockets.js';
import jwt from 'jsonwebtoken';
import { checkApprovedReservationNow } from '../../fastify-service/features/reservation/public/reservation.service.js';

const SECRET = process.env.JWT_SECRET || 'your_strong_secret';
/**
 * 
 * @param {uWS.TemplatedApp} app 
 * @param {*} onCommand 
 */
export function registerControlEndpoint(app, onCommand) {
  app.ws('/control', {
    upgrade: (res, req, context) => {
      const token = req.getHeader('sec-websocket-protocol');
      
      if (!token) {
        res.writeStatus('401 Unauthorized').end();
        return;
      }

      try {
        let isAllowed = false;
        const user = jwt.verify(token, SECRET); // Throws if invalid

        checkApprovedReservationNow(user.id)
          .then((res) => {
            isAllowed = res;    
          })
          .catch(err => {
            console.error(err);
            isAllowed = false;
          });

        if (!isAllowed && user.role !== 'admin') {
          console.log(`403 User ${user.username} tried to connect outside allowed time`);
          res.writeStatus('403 Forbidden').end();
          return;
        } else {
          console.log(`username: ${user.username}, role: ${user.role} connected to /control`);
        }

        res.upgrade(
          { user }, // pass user into ws object
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context
        );
      } catch (err) {
        console.error('JWT error:', err.message);
        res.writeStatus('401 Unauthorized').end();
      }
    },

    open: (ws) => {
      console.log('Connected to /control');
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
