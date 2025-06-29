
import mediasoup from 'mediasoup';
let router;
async function initmediasoup() {
    const worker = await mediasoup.createWorker();
    const server = await worker.createWebRtcServer({
        listenInfos: [
            {
                protocol: 'udp',
                ip: '127.0.0.1',
                announcedAddress: null,
                portRange:{
                    min: 10000,
                    max: 20000
                }
            }
        ]
    });
    router = await worker.createRouter({
        mediaCodecs: [
            {
                kind: 'video',
                mimeType: 'video/h264',
                clockRate: 90000,
                parameters: {
                    'packetization-mode': 1,
                    'profile-level-id': '42e01f',
                    'level-asymmetry-allowed': 1
                }
            }
        ]
    });

    console.log('mediasoup initialized'); 
}

/**
 * Returns the initialized mediasoup router instance.
 * This function should be called after `initmediasoup` to ensure the router is available.
 * 
 * @returns {import('mediasoup').types.Router} The mediasoup router instance.
 */
function getRouter() {
    return router;
}
export {initmediasoup, getRouter};