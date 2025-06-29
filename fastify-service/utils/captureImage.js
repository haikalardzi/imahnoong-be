// utils/captureFrame.js
import { spawn } from 'child_process';

export let lastFrame = null;

export function captureFrame() {
  return new Promise((resolve, reject) => {
    const chunks = [];

    const ffmpeg = spawn('ffmpeg', [
      '-f', 'dshow',                            // Use your actual input device
      '-i', 'video=Integrated Camera',          // Adjust for your platform
      '-frames:v', '1',
      '-q:v', '2',
      '-f', 'image2pipe',
      '-vcodec', 'mjpeg',
      'pipe:1'
    ]);

    ffmpeg.stdout.on('data', (chunk) => {
      chunks.push(chunk);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        lastFrame = Buffer.concat(chunks);
        resolve(lastFrame);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.stderr.on('data', (data) => {
      // Optional: console.error('FFmpeg error:', data.toString());
    });

    ffmpeg.on('error', (err) => {
      reject(err);
    });
  });
}
