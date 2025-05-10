import { spawn } from 'child_process';

export function startFFmpeg(onData) {
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow',
    '-i', 'video=Integrated Camera',
    '-vf', 'scale=1400:788,fps=24',
    '-f', 'image2pipe',
    '-q:v', '5',
    '-vcodec', 'mjpeg',
    'pipe:1'
  ]);

  ffmpeg.stdout.on('data', onData);

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
