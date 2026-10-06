import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  aiMode: (process.env.AI_MODE || 'mock') as 'mock' | 'production',
  jwtSecret: process.env.JWT_SECRET || 'scenara_default_secret_key_change_in_production',
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  storagePath: path.resolve(__dirname, '../../storage'),
  
  db: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'scenara_ai',
  },

  ai: {
    googleApiKey: process.env.GOOGLE_AI_API_KEY || '',
    runwayApiKey: process.env.RUNWAY_API_KEY || '',
    elevenlabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  }
};

// Ensure all media storage subdirectories exist
const subdirs = ['videos', 'audio', 'thumbnails', 'storyboards', 'exports', 'characters'];
for (const dir of subdirs) {
  const fullPath = path.join(config.storagePath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}
