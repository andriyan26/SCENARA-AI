import { IVideoProvider, VideoGenerationOptions } from './base.js';
import { config } from '../../config/env.js';

export class RunwayVideoProvider implements IVideoProvider {
  public name = 'Runway Gen-3';

  public async generateVideo(options: VideoGenerationOptions): Promise<{ jobId: string; videoUrl?: string }> {
    if (!config.ai.runwayApiKey) {
      throw new Error(
        'Runway provider is not configured. Please supply RUNWAY_API_KEY in server/.env or switch AI_MODE=mock for development.'
      );
    }

    try {
      const response = await fetch('https://api.runwayml.com/v1/image_to_video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.ai.runwayApiKey}`,
          'X-Runway-Version': '2024-09-13',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptText: options.prompt,
          model: 'gen3a_turbo',
          duration: options.durationSeconds <= 5 ? 5 : 10,
          ratio: options.aspectRatio === '9:16' ? '768:1280' : '1280:768',
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Runway API responded with ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();
      return { jobId: data.id };
    } catch (err: any) {
      throw new Error(`Runway video generation error: ${err.message}`);
    }
  }

  public async getGenerationStatus(jobId: string): Promise<{ status: 'queued' | 'processing' | 'completed' | 'failed'; progress: number; videoUrl?: string; error?: string }> {
    if (!config.ai.runwayApiKey) {
      return { status: 'failed', progress: 0, error: 'Runway API Key missing.' };
    }

    try {
      const response = await fetch(`https://api.runwayml.com/v1/tasks/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${config.ai.runwayApiKey}`,
          'X-Runway-Version': '2024-09-13',
        }
      });
      const data: any = await response.json();
      if (data.status === 'SUCCEEDED') {
        return { status: 'completed', progress: 100, videoUrl: data.output[0] };
      } else if (data.status === 'FAILED') {
        return { status: 'failed', progress: 0, error: data.failure };
      }
      return { status: 'processing', progress: data.progress ? Math.round(data.progress * 100) : 50 };
    } catch (err: any) {
      return { status: 'failed', progress: 0, error: err.message };
    }
  }

  public async cancelGeneration(jobId: string): Promise<boolean> {
    return true;
  }
}
