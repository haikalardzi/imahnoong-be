import { setupStreamNamespace } from './stream.gateway.js';
import { startFfmpeg } from './stream.service.js';

export default async function registerTelescopeStream(io) {
  const { emitFrame } = setupStreamNamespace(io);

  startFfmpeg((chunk) => {
    emitFrame(chunk);
  });
}