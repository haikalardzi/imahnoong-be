import { spawn } from 'child_process';

export function startFFmpeg(controlBroadcast, streamBroadcast) {
  const ffmpeg = spawn('ffmpeg', [
    '-f', 'dshow',
    '-i', 'video=Integrated Camera',

    // Split input to two outputs
    '-filter_complex', '[0:v]split=2[main][low];[main]scale=1280:720,fps=24[mjpeg];[low]scale=1280:720,fps=15[ts]',

    // --- MJPEG for control ---
    '-map', '[mjpeg]',
    '-q:v', '5',
    '-vcodec', 'mjpeg',
    '-f', 'image2pipe',
    'pipe:3',

    // --- MPEGTS for viewers ---
    '-map', '[ts]',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-c:v', 'libx264',
    '-f', 'mpegts',
    'pipe:4',
  ], {
    stdio: ['ignore', 'pipe', 'pipe', 'pipe', 'pipe']
  });

  // MJPEG stream for controllers
  ffmpeg.stdio[3]?.on('data', controlBroadcast);

  // MPEGTS stream for viewers
  ffmpeg.stdio[4]?.on('data', streamBroadcast);

  ffmpeg.stderr.on('data', (data) => {
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