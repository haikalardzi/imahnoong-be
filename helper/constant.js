
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fastifyUploadRoot = path.resolve(__dirname, '../fastify-service/uploads');

export const JWT_SECRET = process.env.JWT_SECRET || 'your_strong_secret';

export const FASTIFY_URL = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}` || 'http://localhost:9004';