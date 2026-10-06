import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { initializeDatabase } from './database/initDb.js';

// Route imports
import { authRouter } from './modules/auth/authController.js';
import { projectsRouter } from './modules/projects/projectsController.js';
import { scriptsRouter } from './modules/scripts/scriptsController.js';
import { charactersRouter } from './modules/characters/charactersController.js';
import { scenesRouter } from './modules/scenes/scenesController.js';
import { storyboardsRouter } from './modules/storyboards/storyboardsController.js';
import { voicesRouter } from './modules/voices/voicesController.js';
import { audioRouter } from './modules/audio/audioController.js';
import { assetsRouter } from './modules/assets/assetsController.js';
import { generationRouter } from './modules/generation/generationController.js';
import { exportsRouter } from './modules/exports/exportsController.js';
import { usageRouter } from './modules/usage/usageController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static media storage serving
app.use('/storage', express.static(path.resolve(__dirname, '../storage')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/scripts', scriptsRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/scenes', scenesRouter);
app.use('/api/storyboards', storyboardsRouter);
app.use('/api/voices', voicesRouter);
app.use('/api/audio', audioRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/generation', generationRouter);
app.use('/api/exports', exportsRouter);
app.use('/api/usage', usageRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'SCENARA AI - Filmmaking Studio',
    version: '1.0.0',
    mode: config.aiMode,
    timestamp: new Date().toISOString()
  });
});

// Boot server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(config.port, () => {
      console.log(`🎬 ========================================================`);
      console.log(`🎬 SCENARA AI Studio Backend is Live!`);
      console.log(`🎬 URL: http://localhost:${config.port}`);
      console.log(`🎬 AI Mode: ${config.aiMode.toUpperCase()}`);
      console.log(`🎬 MySQL Database: ${config.db.database} on ${config.db.host}:${config.db.port}`);
      console.log(`🎬 Storage Directory: ${config.storagePath}`);
      console.log(`🎬 ========================================================`);
    });
  } catch (err) {
    console.error('❌ Failed to boot server:', err);
    process.exit(1);
  }
}

startServer();
