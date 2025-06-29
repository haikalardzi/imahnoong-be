import { getRouter, initmediasoup } from "./webrtc.js";

let produceTransport;
let videoProducer;

async function createPlainRTPTransport() {
    const router = getRouter();

    const transport = await router.createPlainTransport({
        listenIp: { ip: '127.0.0.1', announcedIp: null },
        comedia: true,
        rtcpMux: false
    });
    return transport;
}

async function startRTPStream() {
    const transport = await createPlainRTPTransport();
    console.log('🎯 FFmpeg send to IP:', transport.tuple.localIp, 'Port:', transport.tuple.localPort);

  // Wait for FFmpeg to start sending RTP
  transport.once('tuple', async () => {
    console.log('📶 RTP packet received — creating producer');

    const videoProducer = await transport.produce({
      kind: 'video',
      rtpParameters: {
        codecs: [{
          mimeType: 'video/H264',
          clockRate: 90000,
          payloadType: 96, // use 96 or match FFmpeg's payload
          rtcpFeedback: [],
          parameters: {
            'packetization-mode': 1,
            'profile-level-id': '42e01f',
            'level-asymmetry-allowed': 1
          }
        }],
        encodings: [{ ssrc: 22222222 }]
      }
    });

    console.log('✅ RTP Producer created from FFmpeg');
  });
}

export { startRTPStream, videoProducer };