import dotenv from 'dotenv';
dotenv.config();

import startFastifyServer from './fastify-service/fastify.js';
import { startWebSocketServer } from './websocket-service/uwebsocket.js';
// import './socketio/socketio.js';

startFastifyServer();
startWebSocketServer();