import { spawn } from 'child_process';

export function startFFmpeg() {
  const ffmpeg = spawn('ffmpeg', [
    // input is MJPEG stream
    '-f', 'image2pipe',
    '-i', 'pipe:0',
    
    // Split input to two outputs
    '-filter_complex', 
    '[0:v]split=2[raw1][raw2];'+
    '[raw1]scale=1280:500[mjpeg];'+
    '[raw2]scale=1280:500[ts]',

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
    stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe']
  });

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