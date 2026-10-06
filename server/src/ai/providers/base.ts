export interface VideoGenerationOptions {
  prompt: string;
  durationSeconds: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  resolution?: '720p' | '1080p' | '4k';
  seed?: number;
  characterProfile?: string;
  cameraMovement?: string;
  cameraAngle?: string;
  referenceImageUrl?: string;
}

export interface VoiceGenerationOptions {
  text: string;
  voiceId: string;
  gender?: string;
  language?: string;
  emotion?: string;
  speed?: number;
}

export interface ScriptGenerationOptions {
  idea: string;
  genre: string;
  targetDurationSeconds: number;
  projectType: string;
  aspectRatio: string;
  visualStyle: string;
  language: string;
}

export interface PlannedScene {
  sceneNumber: number;
  title: string;
  description: string;
  durationSeconds: number;
  location: string;
  timeOfDay: string;
  mood: string;
  cameraAngle: string;
  cameraMovement: string;
  visualPrompt: string;
  dialogue?: string;
  narration?: string;
  soundEffects?: string[];
}

export interface PlannedCharacter {
  name: string;
  age: number;
  gender: string;
  role: string;
  description: string;
  personality: string;
  appearance: string;
  clothing: string;
  voiceId?: string;
  referenceImageUrl?: string;
}

export interface AIPlanningResult {
  title: string;
  logline: string;
  storyArc: {
    act1: string;
    act2: string;
    act3: string;
  };
  totalPlannedDuration: number;
  characters: PlannedCharacter[];
  scenes: PlannedScene[];
  script: string;
  musicRecommendation: {
    genre: string;
    tempo: string;
    mood: string;
  };
}

export interface IVideoProvider {
  name: string;
  generateVideo(options: VideoGenerationOptions): Promise<{ jobId: string; videoUrl?: string }>;
  getGenerationStatus(jobId: string): Promise<{ status: 'queued' | 'processing' | 'completed' | 'failed'; progress: number; videoUrl?: string; error?: string }>;
  cancelGeneration(jobId: string): Promise<boolean>;
}

export interface IVoiceProvider {
  name: string;
  generateVoice(options: VoiceGenerationOptions): Promise<{ audioUrl: string; duration: number }>;
}

export interface ILLMProvider {
  name: string;
  planFilm(options: ScriptGenerationOptions): Promise<AIPlanningResult>;
  assistScript(content: string, action: string, instruction?: string): Promise<string>;
  evaluateScene(prompt: string, dialogue: string, videoUrl?: string): Promise<{ visualScore: number; characterConsistency: number; promptAdherence: number; audioScore: number; feedback: string }>;
}
