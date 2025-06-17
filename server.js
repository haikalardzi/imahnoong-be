import dotenv from 'dotenv';
dotenv.config();

import startFastifyServer from './fastify-service/fastify.js';
import startUWebSocketServer from './uwebsocket-service/uwebsocket.js';
// import './socketio/socketio.js';

startFastifyServer();
startUWebSocketServer();