import { IVoiceProvider, VoiceGenerationOptions } from './base.js';
import { config } from '../../config/env.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ElevenLabsVoiceProvider implements IVoiceProvider {
  public name = 'ElevenLabs';

  public async generateVoice(options: VoiceGenerationOptions): Promise<{ audioUrl: string; duration: number }> {
    if (!config.ai.elevenlabsApiKey) {
      throw new Error(
        'ElevenLabs provider is not configured. Please supply ELEVENLABS_API_KEY in server/.env or switch AI_MODE=mock for development.'
      );
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': config.ai.elevenlabsApiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: options.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${err}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `voice-${uuidv4()}.mp3`;
      const filePath = path.join(config.storagePath, 'audio', filename);
      fs.writeFileSync(filePath, buffer);

      // Estimate duration based on word count (~150 words per minute)
      const words = options.text.trim().split(/\s+/).length;
      const duration = Math.max(2, Math.round((words / 2.5) * 10) / 10);

      return {
        audioUrl: `/storage/audio/${filename}`,
        duration,
      };
    } catch (err: any) {
      throw new Error(`ElevenLabs TTS generation failed: ${err.message}`);
    }
  }
}
