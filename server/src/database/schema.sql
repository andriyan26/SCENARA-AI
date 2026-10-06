-- SCENARA AI - Relational Database Schema (MySQL 8.0+)
-- Character set utf8mb4

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  plan VARCHAR(50) DEFAULT 'pro',
  credits INT DEFAULT 1500,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_type VARCHAR(50) NOT NULL DEFAULT 'short_film',
  genre VARCHAR(50) DEFAULT 'drama',
  target_duration_seconds INT NOT NULL DEFAULT 120,
  aspect_ratio VARCHAR(20) NOT NULL DEFAULT '16:9',
  resolution VARCHAR(20) NOT NULL DEFAULT '1080p',
  language VARCHAR(50) NOT NULL DEFAULT 'Indonesian',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  thumbnail_url TEXT,
  final_video_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS project_settings (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL UNIQUE,
  duration INT NOT NULL DEFAULT 120,
  aspect_ratio VARCHAR(20) NOT NULL DEFAULT '16:9',
  resolution VARCHAR(20) NOT NULL DEFAULT '1080p',
  visual_style VARCHAR(100) DEFAULT 'Cinematic',
  camera_style VARCHAR(100) DEFAULT 'Professional Film',
  color_style VARCHAR(100) DEFAULT 'Moody Teal & Orange',
  language VARCHAR(50) DEFAULT 'Indonesian',
  voice_style VARCHAR(100) DEFAULT 'Emotional Narrator',
  music_style VARCHAR(100) DEFAULT 'Cinematic Orchestral',
  subtitle_enabled BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_proj_settings (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scripts (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT TRUE,
  version INT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scripts_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS characters (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT DEFAULT 24,
  gender VARCHAR(50) DEFAULT 'Male',
  description TEXT,
  personality TEXT,
  appearance TEXT,
  clothing TEXT,
  reference_image_url TEXT,
  voice_id VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_char_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scenes (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  scene_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_seconds INT NOT NULL DEFAULT 15,
  location VARCHAR(255) DEFAULT 'Interior',
  time_of_day VARCHAR(50) DEFAULT 'Day',
  mood VARCHAR(50) DEFAULT 'Hopeful',
  camera_angle VARCHAR(100) DEFAULT 'Medium Shot',
  camera_movement VARCHAR(100) DEFAULT 'Slow Dolly In',
  visual_prompt TEXT,
  dialogue TEXT,
  narration TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  video_url TEXT,
  thumbnail_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scenes_project (project_id, scene_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scene_versions (
  id VARCHAR(36) PRIMARY KEY,
  scene_id VARCHAR(36) NOT NULL,
  version_number INT NOT NULL DEFAULT 1,
  prompt TEXT,
  provider VARCHAR(50) DEFAULT 'veo',
  model VARCHAR(50) DEFAULT 'veo-2.0',
  video_url TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  generation_time INT DEFAULT 12,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scenever_scene (scene_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS storyboards (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  scene_id VARCHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sb_scene (scene_id),
  INDEX idx_sb_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS voices (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) DEFAULT 'elevenlabs',
  provider_voice_id VARCHAR(100) NOT NULL,
  gender VARCHAR(20) DEFAULT 'male',
  language VARCHAR(50) DEFAULT 'en',
  style VARCHAR(100) DEFAULT 'Cinematic Narrator',
  preview_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audio_assets (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  scene_id VARCHAR(36),
  type VARCHAR(50) NOT NULL, -- voice, music, sfx, ambience
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(50) DEFAULT 'elevenlabs',
  audio_url TEXT NOT NULL,
  duration FLOAT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audio_proj (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- image, video, audio, document, character_reference
  file_url TEXT NOT NULL,
  mime_type VARCHAR(100),
  size BIGINT DEFAULT 0,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_assets_user (user_id),
  INDEX idx_assets_proj (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS generation_jobs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36) NOT NULL,
  scene_id VARCHAR(36),
  job_type VARCHAR(50) NOT NULL, -- script, storyboard, image, video, voice, music, sfx, subtitle, render, export
  provider VARCHAR(50) DEFAULT 'veo',
  model VARCHAR(50) DEFAULT 'veo-2.0',
  provider_job_id VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'queued', -- queued, processing, completed, failed, cancelled
  progress INT DEFAULT 0,
  error_message TEXT,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_job_user (user_id),
  INDEX idx_job_project (project_id),
  INDEX idx_job_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exports (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  format VARCHAR(20) DEFAULT 'mp4',
  resolution VARCHAR(20) DEFAULT '1080p',
  aspect_ratio VARCHAR(20) DEFAULT '16:9',
  file_url TEXT NOT NULL,
  duration INT DEFAULT 120,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_export_proj (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_usage (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  project_id VARCHAR(36),
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  operation VARCHAR(100) NOT NULL,
  units INT DEFAULT 1,
  estimated_cost DECIMAL(10,4) DEFAULT 0.0000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usage_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
