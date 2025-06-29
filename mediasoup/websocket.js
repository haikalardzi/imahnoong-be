import { getRouter } from './webrtc.js';
import { createWebRtcTransport, createConsumer } from './consumer.js';

export function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    ws.on('message', async (msg) => {
      const data = JSON.parse(msg);

      if (data.action === 'getRtpCapabilities') {
        ws.send(JSON.stringify({
          action: 'rtpCapabilities',
          data: getRouter().rtpCapabilities
        }));
      }

      if (data.action === 'createTransport') {
        const transport = await createWebRtcTransport({ router: getRouter() });
        ws.transport = transport;

        ws.send(JSON.stringify({
          action: 'transportCreated',
          data: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
          }
        }));
      }

      if (data.action === 'connectTransport') {
        await ws.transport.connect({ dtlsParameters: data.dtlsParameters });
        ws.send(JSON.stringify({ action: 'transportConnected' }));
      }

      if (data.action === 'consume') {
        const consumer = await createConsumer({
          transport: ws.transport,
          rtpCapabilities: data.rtpCapabilities
        });

        ws.send(JSON.stringify({
          action: 'consume',
          data: {
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters
          }
        }));
      }
    });
  });
}
