
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fastifyUploadRoot = path.resolve(__dirname, '../fastify-service/uploads');

export const JWT_SECRET = process.env.JWT_SECRET || 'your_strong_secret';

export const FASTIFY_URL = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}` || 'http://localhost:9004';

export const WS_URL = `ws://${process.env.WS_HOST}:${process.env.WS_PORT}` || 'ws://localhost:9005';

export const FE_URL = 'https://proto.28manzilah.com';
