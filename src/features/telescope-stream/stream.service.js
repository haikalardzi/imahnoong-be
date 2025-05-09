import { spawn } from 'child_process';

export function startFfmpeg(onFrame) {
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow',
    '-i', 'video=Integrated Camera',
    '-vf', 'scale=1400:788,fps=24',
    '-f', 'image2pipe',
    '-q:v', '5',
    '-vcodec', 'mjpeg',
    'pipe:1'
  ]);

    ffmpeg.stdout.on('data', onFrame);

    ffmpeg.stderr.on('error', (error) => {
      console.error(`FFmpeg stderr: ${error}`);
    });

    return ffmpeg;
}