import { spawn } from 'child_process';

export function startFfmpeg(clients) {
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow',
    '-i', 'video=Integrated Camera',
    '-vf', 'scale=1400:788,fps=24',
    '-f', 'image2pipe',
    '-q:v', '5',
    '-vcodec', 'mjpeg',
    'pipe:1'
  ]);

  ffmpeg.stdout.on('data', (chunk) => {
    for (const client of clients) {
      if (!client.closed) {
        client.send(chunk, true); // Send binary
      }
    }
  });

  ffmpeg.stderr.on('data', (data) => {
    // Uncomment to debug FFmpeg
    // console.error(`FFmpeg: ${data}`);
  });

  return ffmpeg;
}