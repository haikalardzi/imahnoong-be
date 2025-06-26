import { spawn } from 'child_process';

export function startFFmpeg(sendChunk) {
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow',
    '-i', 'video=Integrated Camera',
    '-vf', 'scale=1280:720,fps=24',
    '-f', 'image2pipe',
    '-q:v', '5',
    '-vcodec', 'mjpeg',
    'pipe:1'
  ]);

  ffmpeg.stdout.on('data', sendChunk);

  ffmpeg.stderr.on('data', (data) => {
    // Uncomment if needed
    // console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on('error', (err) => {
    console.error('FFmpeg error:', err);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });

  return ffmpeg;
}
