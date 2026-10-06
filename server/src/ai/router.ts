import { config } from '../config/env.js';
import { IVideoProvider, IVoiceProvider, ILLMProvider } from './providers/base.js';
import { VeoVideoProvider } from './providers/veo.js';
import { RunwayVideoProvider } from './providers/runway.js';
import { ElevenLabsVoiceProvider } from './providers/elevenlabs.js';
import { GeminiLLMProvider } from './providers/gemini.js';
import { MockVideoProvider, MockVoiceProvider, MockLLMDirector } from './providers/mock.js';

export class AIRouter {
  private static instance: AIRouter;

  private mockVideo = new MockVideoProvider();
  private mockVoice = new MockVoiceProvider();
  private mockLLM = new MockLLMDirector();

  private veo = new VeoVideoProvider();
  private runway = new RunwayVideoProvider();
  private elevenlabs = new ElevenLabsVoiceProvider();
  private gemini = new GeminiLLMProvider();

  public static getInstance(): AIRouter {
    if (!AIRouter.instance) {
      AIRouter.instance = new AIRouter();
    }
    return AIRouter.instance;
  }

  public getVideoProvider(preference?: 'veo' | 'runway' | 'mock'): IVideoProvider {
    if (config.aiMode === 'mock') {
      return this.mockVideo;
    }

    if (preference === 'runway' && config.ai.runwayApiKey) {
      return this.runway;
    }

    if (config.ai.googleApiKey) {
      return this.veo;
    }

    // If real keys not provided, fallback to Mock with informative log
    console.warn('⚠️ [AIRouter] Real video API keys not configured. Falling back to simulated high-fidelity provider.');
    return this.mockVideo;
  }

  public getVoiceProvider(preference?: 'elevenlabs' | 'mock'): IVoiceProvider {
    if (config.aiMode === 'mock') {
      return this.mockVoice;
    }

    if (config.ai.elevenlabsApiKey) {
      return this.elevenlabs;
    }

    console.warn('⚠️ [AIRouter] ElevenLabs API key not configured. Falling back to simulated voice provider.');
    return this.mockVoice;
  }

  public getLLMProvider(preference?: 'gemini' | 'mock'): ILLMProvider {
    if (config.aiMode === 'mock') {
      return this.mockLLM;
    }

    if (config.ai.googleApiKey) {
      return this.gemini;
    }

    console.warn('⚠️ [AIRouter] Gemini API key not configured. Falling back to built-in AI Director.');
    return this.mockLLM;
  }
}
