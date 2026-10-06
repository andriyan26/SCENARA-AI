import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageAudioDir = path.resolve(__dirname, '../../storage/audio');

if (!fs.existsSync(storageAudioDir)) {
  fs.mkdirSync(storageAudioDir, { recursive: true });
}

// Generate a valid RIFF PCM WAV buffer
function createWavBuffer(sampleRate = 44100, durationSec = 5, generator: (t: number) => number): Buffer {
  const numSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = 2; // 1 channel * 16 bits / 8
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20);  // audio format (PCM = 1)
  buffer.writeUInt16LE(1, 22);  // num channels (1 = mono)
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generator(t)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

// 1. Cinematic Ambient Music (Warm lush chords: C minor -> G minor)
const musicWav = createWavBuffer(44100, 10, (t) => {
  // Pad chords C3, Eb3, G3, Bb3
  const c = Math.sin(2 * Math.PI * 130.81 * t) * 0.25;
  const eb = Math.sin(2 * Math.PI * 155.56 * t) * 0.2;
  const g = Math.sin(2 * Math.PI * 196.00 * t) * 0.2;
  const bb = Math.sin(2 * Math.PI * 233.08 * t) * 0.15;
  const sub = Math.sin(2 * Math.PI * 65.41 * t) * 0.3; // low C bass
  // Envelope
  const env = Math.min(1, t / 0.5) * Math.min(1, (10 - t) / 0.5);
  return (c + eb + g + bb + sub) * env * 0.6;
});
fs.writeFileSync(path.join(storageAudioDir, 'cinematic_theme.wav'), musicWav);

// 2. Sub-bass Impact / Boom
const impactWav = createWavBuffer(44100, 3, (t) => {
  const freq = 120 * Math.exp(-t * 3); // Pitch drops from 120Hz to sub
  const env = Math.exp(-t * 2.5);
  const sine = Math.sin(2 * Math.PI * freq * t);
  const rumble = (Math.random() * 2 - 1) * 0.15 * Math.exp(-t * 4);
  return (sine * 0.7 + rumble) * env;
});
fs.writeFileSync(path.join(storageAudioDir, 'sub_impact.wav'), impactWav);

// 3. Ambient Rain & Thunder
const rainWav = createWavBuffer(44100, 6, (t) => {
  const noise = (Math.random() * 2 - 1) * 0.2;
  const thunder = (t > 1.5 && t < 4.5) ? Math.sin(2 * Math.PI * 45 * t) * 0.25 * Math.exp(-(t - 1.5)) : 0;
  return noise + thunder;
});
fs.writeFileSync(path.join(storageAudioDir, 'rain_thunder.wav'), rainWav);

// 4. Voice Sample Chime
const chimeWav = createWavBuffer(44100, 2, (t) => {
  const note1 = Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-t * 2); // C5
  const note2 = Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-t * 2.5); // E5
  return (note1 + note2) * 0.35;
});
fs.writeFileSync(path.join(storageAudioDir, 'voice_sample.wav'), chimeWav);

console.log('✅ Generated local WAV audio assets in server/storage/audio/ successfully!');
