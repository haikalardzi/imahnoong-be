import { videoProducer } from './broadcaster.js';

/**
 * 
 * @param {{ router: import('mediasoup').types.Router}} param0 
 * @returns 
 */
export async function createWebRtcTransport({ router }) {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: '127.0.0.1', announcedIp: null }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true
  });

  return transport;
}

/**
 * 
 * @param {{
 *     router: import('mediasoup').types.Router,
 *     transport: import('mediasoup').types.WebRtcTransport,
 *     rtpCapabilities: import('mediasoup').types.RtpCapabilities
 * }} param0 
 * @returns 
 */
export async function createConsumer({ router, transport, rtpCapabilities }) {
  if (!videoProducer) throw new Error("No video producer yet");

  if (!router.canConsume({ producerId: videoProducer.id, rtpCapabilities })) {
    throw new Error("Client cannot consume this producer");
  }

  const consumer = await transport.consume({
    producerId: videoProducer.id,
    rtpCapabilities,
    paused: false
  });

  return consumer;
}
