import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ffmpegPath = path.resolve(__dirname, '../../node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
const storyboardsDir = path.resolve(__dirname, '../../storage/storyboards');
const videosDir = path.resolve(__dirname, '../../storage/videos');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

interface SceneSpec {
  num: number;
  duration: number;
  zoomFilter: string;
}

const scenes: SceneSpec[] = [
  { num: 1, duration: 8, zoomFilter: "zoompan=z='min(zoom+0.0012,1.15)':d=200:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 2, duration: 12, zoomFilter: "zoompan=z='min(zoom+0.0010,1.18)':d=300:x='iw/2-(iw/zoom/2)+sin(in/30)*20':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 3, duration: 15, zoomFilter: "zoompan=z='min(zoom+0.0008,1.15)':d=375:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 4, duration: 15, zoomFilter: "zoompan=z='min(zoom+0.0008,1.16)':d=375:x='iw/2-(iw/zoom/2)-sin(in/40)*25':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 5, duration: 18, zoomFilter: "zoompan=z='min(zoom+0.0007,1.15)':d=450:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 6, duration: 16, zoomFilter: "zoompan=z='min(zoom+0.0008,1.14)':d=400:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 7, duration: 18, zoomFilter: "zoompan=z='min(zoom+0.0007,1.15)':d=450:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
  { num: 8, duration: 18, zoomFilter: "zoompan=z='if(lte(zoom,1.0),1.15,max(1.0,zoom-0.0006))':d=450:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=25" },
];

async function run() {
  console.log('--- START GENERATING ALL 8 SCENE VIDEOS ---');

  const fileListContent: string[] = [];

  for (const sc of scenes) {
    const inputImg = path.join(storyboardsDir, `scene_${sc.num}.jpg`);
    const outputVideo = path.join(videosDir, `scene_${sc.num}.mp4`);

    if (!fs.existsSync(inputImg)) {
      console.error(`Missing input image: ${inputImg}`);
      continue;
    }

    console.log(`Rendering Scene ${sc.num} (${sc.duration}s)...`);
    const cmd = `"${ffmpegPath}" -loop 1 -i "${inputImg}" -c:v libx264 -t ${sc.duration} -pix_fmt yuv420p -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,${sc.zoomFilter}" -y "${outputVideo}"`;
    
    await execPromise(cmd);
    console.log(`✓ Scene ${sc.num} generated: ${outputVideo}`);

    // Add to concatenation list with absolute path or relative
    fileListContent.push(`file '${outputVideo.replace(/\\/g, '/')}'`);
  }

  // Create concat file for master preview
  const concatFilePath = path.join(videosDir, 'concat_list.txt');
  fs.writeFileSync(concatFilePath, fileListContent.join('\n'));
  console.log(`Concat list written to ${concatFilePath}`);

  // Generate master_preview.mp4
  const masterPreviewPath = path.join(videosDir, 'master_preview.mp4');
  console.log(`Concatenating all scenes into master_preview.mp4...`);
  const concatCmd = `"${ffmpegPath}" -f concat -safe 0 -i "${concatFilePath}" -c copy -y "${masterPreviewPath}"`;
  await execPromise(concatCmd);
  console.log(`✓ MASTER PREVIEW GENERATED: ${masterPreviewPath}`);

  console.log('--- ALL VIDEOS SUCCESSFULLY CREATED ---');
}

run().catch(err => {
  console.error('Error generating videos:', err);
  process.exit(1);
});
