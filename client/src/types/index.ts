export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  plan: string;
  credits: number;
}

export interface ProjectSettings {
  id: string;
  project_id: string;
  duration: number;
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5';
  resolution: '720p' | '1080p' | '4k';
  visual_style: string;
  camera_style: string;
  color_style: string;
  language: string;
  voice_style: string;
  music_style: string;
  subtitle_enabled: boolean;
}

export interface Script {
  id: string;
  project_id: string;
  title: string;
  content: string;
  ai_generated: boolean;
  version: number;
  created_at: string;
}

export interface Character {
  id: string;
  project_id?: string;
  name: string;
  age: number;
  gender: string;
  description: string;
  personality?: string;
  personality_traits?: string;
  appearance: string;
  clothing: string;
  reference_image_url: string;
  voice_id: string;
  created_at?: string;
}

export interface SceneVersion {
  id: string;
  scene_id: string;
  version_number: number;
  prompt: string;
  provider: string;
  model: string;
  video_url: string;
  status: string;
  generation_time: number;
  created_at: string;
}

export interface Scene {
  id: string;
  project_id: string;
  scene_number: number;
  title: string;
  description: string;
  duration_seconds: number;
  location: string;
  time_of_day: string;
  mood: string;
  camera_angle: string;
  camera_movement: string;
  visual_prompt: string;
  dialogue?: string;
  narration?: string;
  status: 'draft' | 'planning' | 'generating' | 'completed' | 'failed';
  video_url: string;
  thumbnail_url: string;
  versions?: SceneVersion[];
  created_at: string;
}

export interface Storyboard {
  id: string;
  project_id: string;
  scene_id: string;
  image_url: string;
  prompt: string;
  created_at: string;
}

export interface Voice {
  id: string;
  name: string;
  provider: string;
  provider_voice_id: string;
  gender: string;
  language: string;
  style: string;
  preview_url: string;
}

export interface AudioAsset {
  id: string;
  project_id: string;
  scene_id?: string;
  type: 'voice' | 'music' | 'sfx' | 'ambience';
  name: string;
  provider: string;
  audio_url: string;
  duration: number;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'character_reference';
  file_url: string;
  mime_type: string;
  size: number;
  created_at: string;
}

export interface ExportRecord {
  id: string;
  project_id: string;
  format: string;
  resolution: string;
  aspect_ratio: string;
  file_url: string;
  duration: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  project_type: 'short_video' | 'social_media' | 'advertisement' | 'cinematic' | 'short_film' | 'educational' | 'presentation' | 'custom';
  genre: string;
  target_duration_seconds: number;
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:5';
  resolution: '720p' | '1080p' | '4k';
  language: string;
  status: 'draft' | 'planning' | 'generating' | 'editing' | 'completed' | 'failed';
  thumbnail_url: string;
  final_video_url: string;
  scene_count?: number;
  character_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetailResponse {
  project: Project;
  settings: ProjectSettings;
  script: Script;
  characters: Character[];
  scenes: Scene[];
  storyboards: Storyboard[];
  exports: ExportRecord[];
  audioAssets: AudioAsset[];
}
