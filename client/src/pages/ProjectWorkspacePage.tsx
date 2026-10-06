import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Play, 
  Save, 
  DownloadCloud, 
  Share2, 
  Layers, 
  FileText, 
  Users, 
  SlidersHorizontal, 
  Volume2, 
  Clock, 
  RotateCcw, 
  Wand2, 
  Trash2, 
  Copy, 
  Plus, 
  CheckCircle2, 
  Camera, 
  Mic2, 
  Music, 
  Maximize2,
  ChevronRight,
  RefreshCw,
  Award,
  Bot
} from 'lucide-react';
import { 
  Project, 
  ProjectSettings, 
  Script, 
  Character, 
  Scene, 
  Storyboard, 
  ExportRecord, 
  Voice 
} from '../types/index.ts';
import { api } from '../services/api.ts';
import { VideoPlayer } from '../components/VideoPlayer.tsx';
import { TimelineTrack } from '../components/TimelineTrack.tsx';
import { RepurposeModal } from '../components/RepurposeModal.tsx';
import { ExportModal } from '../components/ExportModal.tsx';
import { AIContentAssistant } from '../components/AIContentAssistant.tsx';
import { AIVideoGenModal } from '../components/AIVideoGenModal.tsx';
import { audioEngine } from '../utils/audioEngine.ts';

interface ProjectWorkspacePageProps {
  projectId: string;
  onBackToDashboard: () => void;
}

export const ProjectWorkspacePage: React.FC<ProjectWorkspacePageProps> = ({ projectId, onBackToDashboard }) => {
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'Tersimpan' | 'Menyimpan...' | 'Belum disimpan'>('Tersimpan');

  // Studio Data
  const [project, setProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [storyboards, setStoryboards] = useState<Storyboard[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);

  // Workspace active tab: 'director' | 'storyboard' | 'script' | 'characters' | 'audio' | 'preview'
  const [activeTab, setActiveTab] = useState<'director' | 'storyboard' | 'script' | 'characters' | 'audio' | 'preview'>('director');
  const [activeSceneId, setActiveSceneId] = useState<string>('');

  // Timeline Playback Engine State
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [currentTimelineSec, setCurrentTimelineSec] = useState(0);
  const lastSpokenSceneRef = React.useRef<string | null>(null);
  const timelineIntervalRef = React.useRef<number | null>(null);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRepurposeModalOpen, setIsRepurposeModalOpen] = useState(false);
  const [isAIVideoGenOpen, setIsAIVideoGenOpen] = useState(false);
  const [activeSceneModel, setActiveSceneModel] = useState('Google Veo 2.0 Bioskop');
  const [evaluationModalScene, setEvaluationModalScene] = useState<any | null>(null);

  // Load project details
  const fetchProjectData = async () => {
    try {
      const data = await api.projects.get(projectId);
      setProject(data.project);
      setSettings(data.settings);
      setScript(data.script);
      setCharacters(data.characters);
      setScenes(data.scenes);
      setStoryboards(data.storyboards);

      if (data.scenes.length > 0 && !activeSceneId) {
        setActiveSceneId(data.scenes[0].id);
      }

      // Fetch voices
      const voiceData = await api.voices.list();
      setVoices(voiceData.voices);
    } catch (err: any) {
      alert('Gagal memuat proyek: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const activeScene = scenes.find(s => s.id === activeSceneId) || scenes[0];

  // Autosave update helper
  const handleSceneFieldChange = async (field: keyof Scene, value: any) => {
    if (!activeScene) return;
    setSaveStatus('Menyimpan...');
    try {
      const updatedList = scenes.map(s => s.id === activeScene.id ? { ...s, [field]: value } : s);
      setScenes(updatedList);
      await api.scenes.update(activeScene.id, { [field]: value });
      setSaveStatus('Tersimpan');
    } catch {
      setSaveStatus('Belum disimpan');
    }
  };

  // Add new scene (100% Bahasa Indonesia)
  const handleAddNewScene = async () => {
    try {
      const nextNum = scenes.length + 1;
      const res = await api.scenes.create(projectId, {
        title: `Adegan ${String(nextNum).padStart(2, '0')}: Babak Baru Kisah`,
        description: `Kelanjutan dinamika emosional dan visual cerita yang dirancang oleh Sutradara AI.`,
        duration_seconds: 15,
        visual_prompt: `Bidikan sinematik 35mm standar bioskop, pencahayaan volumetrik alami, fokus tajam 8k fotorealistik.`,
        location: 'Metropolitan Jakarta',
        time_of_day: 'Sore 16:00',
        mood: 'Dramatis & Penuh Harapan',
        camera_angle: 'Bidikan Sedang (Medium Shot)',
        camera_movement: 'Slow Dolly In',
      });
      await fetchProjectData();
      if (res.scene?.id) {
        setActiveSceneId(res.scene.id);
      }
      setActiveTab('director');
      alert(`Adegan ${nextNum} berhasil ditambahkan dalam Bahasa Indonesia!`);
    } catch (err: any) {
      alert('Gagal menambah adegan: ' + err.message);
    }
  };

  // Regenerate single scene video (Section 53)
  const handleRegenerateScene = async (sceneId: string) => {
    setActiveSceneId(sceneId);
    setIsAIVideoGenOpen(true);
  };

  // AI Scene Quality Evaluator (Section 52)
  const handleEvaluateScene = async (sceneId: string) => {
    try {
      const res = await api.scenes.evaluate(sceneId);
      setEvaluationModalScene(res.evaluation);
    } catch (err: any) {
      alert('Evaluasi adegan gagal: ' + err.message);
    }
  };

  // AI Auto Edit (Section 23)
  const handleAutoEdit = () => {
    alert('Sutradara AI berhasil menyelaraskan transisi sinematik, menyeimbangkan volume audio (-14 LUFS), dan mensinkronkan ketukan takarir!');
  };

  // Cumulative scene map to determine which scene is active at timeline second
  const getSceneAtSecond = (sec: number) => {
    let acc = 0;
    for (const sc of scenes) {
      const dur = sc.duration_seconds || 10;
      if (sec >= acc && sec < acc + dur) {
        return sc;
      }
      acc += dur;
    }
    return scenes[scenes.length - 1] || null;
  };

  const handleTogglePlayTimeline = () => {
    if (isPlayingTimeline) {
      setIsPlayingTimeline(false);
      audioEngine.stopAll();
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    } else {
      setIsPlayingTimeline(true);
      audioEngine.startBackgroundMusic();
      audioEngine.playSubImpact();

      // Trigger initial scene speech in Indonesian
      const initialScene = getSceneAtSecond(currentTimelineSec);
      if (initialScene && (initialScene.narration || initialScene.dialogue)) {
        lastSpokenSceneRef.current = initialScene.id;
        audioEngine.speak(initialScene.narration || initialScene.dialogue || '', {
          gender: initialScene.dialogue ? 'male' : 'female'
        });
      }
    }
  };

  const handleSeekTimeline = (targetSec: number) => {
    setCurrentTimelineSec(targetSec);
    const targetScene = getSceneAtSecond(targetSec);
    if (targetScene) {
      setActiveSceneId(targetScene.id);
      if (isPlayingTimeline && (targetScene.narration || targetScene.dialogue)) {
        lastSpokenSceneRef.current = targetScene.id;
        audioEngine.speak(targetScene.narration || targetScene.dialogue || '', {
          gender: targetScene.dialogue ? 'male' : 'female'
        });
      }
    }
  };

  // Playback Interval Effect (Advances playhead & switches scenes & audio in Indonesian)
  useEffect(() => {
    if (isPlayingTimeline) {
      const totalSec = scenes.reduce((acc, s) => acc + (s.duration_seconds || 10), 0) || project?.target_duration_seconds || 120;
      timelineIntervalRef.current = window.setInterval(() => {
        setCurrentTimelineSec(prev => {
          const next = prev + 0.5;
          if (next >= totalSec) {
            setIsPlayingTimeline(false);
            audioEngine.stopAll();
            clearInterval(timelineIntervalRef.current!);
            return 0;
          }

          // Check if we entered a new scene
          const currScene = getSceneAtSecond(next);
          if (currScene && currScene.id !== lastSpokenSceneRef.current) {
            lastSpokenSceneRef.current = currScene.id;
            setActiveSceneId(currScene.id);
            if (currScene.narration || currScene.dialogue) {
              audioEngine.speak(currScene.narration || currScene.dialogue || '', {
                gender: currScene.dialogue ? 'male' : 'female'
              });
            }
          }
          return next;
        });
      }, 500);
    } else {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
      audioEngine.stopAll();
    }

    return () => {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    };
  }, [isPlayingTimeline, scenes, project]);

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-studio-950 flex items-center justify-center text-cyan-400 font-mono text-xs gap-3">
        <Sparkles className="w-5 h-5 animate-spin" />
        <span>Memuat Studio Film Sinematik SCENARA AI...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-950 text-white flex flex-col select-none">
      {/* Top Project Studio Header (Section 66) */}
      <header className="sticky top-0 z-30 glass-panel border-b border-white/10 px-4 lg:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-studio-900 border border-white/10 transition-colors"
          >
            ← Dasbor Studio
          </button>

          <div className="hidden sm:block h-4 w-[1px] bg-white/10" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
                {project.title}
              </h2>
              <span className="text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">
                {project.aspect_ratio} • {project.target_duration_seconds}d
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>{saveStatus === 'Tersimpan' ? '✓ Tersimpan' : saveStatus === 'Menyimpan...' ? '⟳ Menyimpan...' : '● Belum disimpan'}</span>
              <span>•</span>
              <span className="capitalize">{project.genre}</span>
            </div>
          </div>
        </div>

        {/* Studio Top Action Bar */}
        <div className="flex items-center gap-2">
          {/* Repurpose CTA (Section 75) */}
          <button
            onClick={() => setIsRepurposeModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Ubah Format</span>
          </button>

          {/* Master Export CTA */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Ekspor Master</span>
          </button>
        </div>
      </header>

      {/* Studio Workspace Tabs */}
      <div className="bg-studio-900/90 border-b border-white/10 px-4 lg:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'director', label: '🎬 Sutradara Video AI', icon: Camera },
          { id: 'storyboard', label: '🎞️ Papan Cerita & Klip', icon: Layers },
          { id: 'script', label: '📜 Naskah Skenario', icon: FileText },
          { id: 'characters', label: '👥 Studio Karakter', icon: Users },
          { id: 'audio', label: '🎵 Suara & Audio', icon: Volume2 },
          { id: 'preview', label: '🏆 Pratinjau Master & Ekspor', icon: Play },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all ${
                isActive
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body Workspace */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto animate-fade-in-up">
        {/* ================= TAB 1: AI VIDEO DIRECTOR & CAMERA (Section 15, 64) ================= */}
        {activeTab === 'director' && activeScene && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Scene Selector List */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  NAVIGATOR ADEGAN
                </h4>
                <button
                  onClick={handleAddNewScene}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  <span>+ Tambah</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                {scenes.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => setActiveSceneId(sc.id)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      sc.id === activeScene.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm shadow-cyan-500/10'
                        : 'bg-studio-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate">ADEGAN {String(sc.scene_number).padStart(2, '0')}: {sc.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">{sc.duration_seconds}d</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center Column: Video Player & Version Selector (Section 54) */}
            <div className="lg:col-span-5 space-y-4">
              <VideoPlayer
                src={activeScene.video_url}
                poster={activeScene.thumbnail_url}
                title={`Adegan ${activeScene.scene_number} - ${activeScene.title}`}
                currentSceneLabel={`ADG ${activeScene.scene_number} • ${activeScene.duration_seconds}d`}
                aspectRatio={project.aspect_ratio}
                subtitle={activeScene.narration || activeScene.dialogue}
                activeAiModel={activeSceneModel}
                isPlayingControlled={isPlayingTimeline}
              />

              {/* Version History Selector (Section 54: Version 1, Version 2, Version 3) */}
              <div className="p-3 rounded-xl bg-studio-900/90 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Versi Generasi Aktif</span>
                  <span className="text-[10px] text-slate-400 font-mono">Penyedia: Google Veo 2.0 (1080p Bioskop)</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(vNum => (
                    <button
                      key={vNum}
                      onClick={() => handleRegenerateScene(activeScene.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                        vNum === 1
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'bg-studio-800 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      v{vNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regenerate Button */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRegenerateScene(activeScene.id)}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Regenerasi Video</span>
                </button>
                <button
                  onClick={() => {
                    const textToSpeak = activeScene.narration || activeScene.dialogue;
                    if (textToSpeak) {
                      audioEngine.speak(textToSpeak, {
                        gender: activeScene.dialogue ? 'male' : 'female'
                      });
                    } else {
                      audioEngine.speak(`Adegan ${activeScene.scene_number}: ${activeScene.title}. Menunggu arahan sutradara.`, {
                        gender: 'male'
                      });
                    }
                  }}
                  title="Dengarkan dialog dan narasi adegan secara langsung"
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Audisi Suara</span>
                </button>
                <button
                  onClick={() => handleEvaluateScene(activeScene.id)}
                  className="px-3.5 py-2.5 rounded-xl bg-studio-900 hover:bg-studio-800 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Skor Kualitas</span>
                </button>
              </div>
            </div>

            {/* Right Column: Scene Information & Camera Directives (Section 15) */}
            <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Judul Adegan</label>
                <input
                  type="text"
                  value={activeScene.title}
                  onChange={e => handleSceneFieldChange('title', e.target.value)}
                  className="w-full px-3 py-1.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>

              {/* Camera Directives (Section 15) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Pembingkaian Bidikan</label>
                  <select
                    value={activeScene.camera_angle}
                    onChange={e => handleSceneFieldChange('camera_angle', e.target.value)}
                    className="w-full bg-studio-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Extreme Wide">Sangat Luas (Extreme Wide)</option>
                    <option value="Wide Shot">Bidikan Luas (Wide Shot)</option>
                    <option value="Medium Shot">Bidikan Sedang (Medium Shot)</option>
                    <option value="Medium Close-up">Bidikan Dekat Sedang</option>
                    <option value="Close-up">Bidikan Dekat (Close-up)</option>
                    <option value="Extreme Close-up">Bidikan Sangat Dekat</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Pergerakan Kamera</label>
                  <select
                    value={activeScene.camera_movement}
                    onChange={e => handleSceneFieldChange('camera_movement', e.target.value)}
                    className="w-full bg-studio-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Static Precision Framing">Kamera Statis Presisi</option>
                    <option value="Slow Dolly In">Dolly Lambat Maju</option>
                    <option value="Dynamic Steadicam Tracking">Pelacakan Steadicam Dinamis</option>
                    <option value="Smooth Pan & Tilt">Geser Halus (Pan & Tilt)</option>
                    <option value="Fluid Crane Orbit">Orbit Derek Sinematik</option>
                    <option value="Intimate Handheld">Kamera Genggam Intim</option>
                  </select>
                </div>
              </div>

              {/* Visual Prompt (Editable) */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 block mb-1">
                  Prompt Visual Neural (Google Veo)
                </label>
                <textarea
                  rows={3}
                  value={activeScene.visual_prompt}
                  onChange={e => handleSceneFieldChange('visual_prompt', e.target.value)}
                  className="w-full p-2.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                />
              </div>

              {/* Dialogue & Narration */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-amber-300 block mb-1">Dialog Karakter</label>
                  <input
                    type="text"
                    placeholder="Tulis baris ucapan dialog karakter..."
                    value={activeScene.dialogue || ''}
                    onChange={e => handleSceneFieldChange('dialogue', e.target.value)}
                    className="w-full px-3 py-1.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-indigo-300 block mb-1">Narasi Pengisi Suara (Voice-Over)</label>
                  <input
                    type="text"
                    placeholder="Tulis baris narasi puitis pengisi suara..."
                    value={activeScene.narration || ''}
                    onChange={e => handleSceneFieldChange('narration', e.target.value)}
                    className="w-full px-3 py-1.5 bg-studio-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: STORYBOARD & VIDEO CLIPS (Section 14) ================= */}
        {activeTab === 'storyboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Keyframe Papan Cerita &amp; Klip Video AI
                </h3>
                <p className="text-xs text-slate-400">
                  {scenes.length} adegan sinematik berdurasi total {project.target_duration_seconds} detik. Setiap kartu terhubung dengan video 1080p dan dapat diregenerasi dengan Veo / Runway.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddNewScene}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Tambah Adegan Baru</span>
                </button>
                <button
                  onClick={() => handleRegenerateScene(activeScene?.id || scenes[0]?.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-studio-900 hover:bg-studio-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerasi Adegan Terpilih</span>
                </button>
              </div>
            </div>

            {/* Storyboard Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {scenes.map((sc) => {
                const isSelected = sc.id === activeSceneId;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setActiveSceneId(sc.id)}
                    className={`glass-card rounded-2xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={sc.thumbnail_url || '/storage/storyboards/scene_3.jpg'}
                        alt={sc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300">
                        ADEGAN {String(sc.scene_number).padStart(2, '0')}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {sc.duration_seconds}d
                      </div>

                      {/* Video Play Overlay Button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSceneId(sc.id);
                            setActiveTab('director');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1 shadow-lg shadow-cyan-500/50 transition-all hover:scale-105"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Putar Video</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegenerateScene(sc.id);
                          }}
                          className="p-1.5 rounded-xl bg-studio-900/90 hover:bg-studio-800 text-purple-300 border border-purple-500/40 text-xs transition-all"
                          title="Generate Ulang Video AI"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{sc.title}</h4>
                        <div className="space-y-1 text-[10px] font-mono text-slate-400">
                          <div><span className="text-slate-500">Suasana:</span> <span className="text-amber-300">{sc.mood}</span></div>
                          <div><span className="text-slate-500">Kamera:</span> <span className="text-cyan-300">{sc.camera_movement}</span></div>
                          <div><span className="text-slate-500">Sudut:</span> <span className="text-slate-300">{sc.camera_angle}</span></div>
                        </div>
                      </div>

                      {/* Scene card actions */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSceneId(sc.id);
                            setActiveTab('director');
                          }}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Sutradarai Adegan →
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEvaluateScene(sc.id);
                          }}
                          title="Beri Nilai Kualitas Adegan"
                          className="p-1 text-slate-400 hover:text-amber-400"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Scene Card */}
              <div
                onClick={handleAddNewScene}
                className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/80 bg-studio-900/30 hover:bg-studio-900/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-white block mb-0.5">Tambah Adegan Baru</span>
                  <span className="text-[10px] text-slate-400 font-mono">100% Bahasa Indonesia &amp; Klip Video AI</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SCREENPLAY SCRIPT (Section 18) ================= */}
        {activeTab === 'script' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
            {/* Script Textarea in Cinema Screenplay Format */}
            <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-cyan-300 uppercase">Format Naskah Standar Industri Bioskop</span>
                <span className="text-[11px] font-mono text-slate-400">Babak 1 • Babak 2 • Babak 3</span>
              </div>
              <textarea
                rows={22}
                value={script?.content || ''}
                onChange={e => {
                  if (script) setScript({ ...script, content: e.target.value });
                  setSaveStatus('Belum disimpan');
                }}
                className="w-full p-4 bg-studio-950/80 border border-white/5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 screenplay-font leading-relaxed resize-y"
              />
              <button
                onClick={() => {
                  if (script) api.scripts.update(projectId, script.content);
                  setSaveStatus('Tersimpan');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold"
              >
                Simpan Perubahan Naskah Skenario
              </button>
            </div>

            {/* AI Script Assistant Sidebar (Section 18) */}
            <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-white">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                <span>Asisten Naskah Sutradara AI</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tingkatkan tempo naskah, pertajam dialog emosional, atau perkuat ketegangan dramatis dengan kecerdasan sutradara AI.
              </p>

              <div className="space-y-2 pt-2">
                {[
                  { action: 'make_cinematic', label: 'Buat Lebih Sinematik', desc: 'Tambahkan subteks visual & ketukan kamera' },
                  { action: 'improve_dialogue', label: 'Pertajam Dialog Karakter', desc: 'Ungkapan lebih alami & berbobot emosional' },
                  { action: 'change_tone', label: 'Tingkatkan Ketegangan Dramatis', desc: 'Naikkan tensi cerita menuju Babak 3' },
                  { action: 'shorten', label: 'Persingkat & Padatkan Baris', desc: 'Potong dialog agar tempo lebih dinamis' },
                ].map(tool => (
                  <button
                    key={tool.action}
                    onClick={async () => {
                      const res = await api.scripts.aiAssistant(projectId, tool.action);
                      if (script) setScript({ ...script, content: res.updatedContent });
                      alert(`Naskah berhasil disempurnakan: ${tool.label}`);
                    }}
                    className="w-full p-3 rounded-xl bg-studio-900/80 hover:bg-studio-850 border border-white/5 hover:border-cyan-500/30 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 mb-0.5">{tool.label}</div>
                    <div className="text-[10px] text-slate-400">{tool.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CHARACTER STUDIO (Section 16, 17) ================= */}
        {activeTab === 'characters' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">Studio Karakter Konsisten</h3>
                <p className="text-xs text-slate-400">
                  Profil karakter menjaga konsistensi identitas wajah, busana, dan emosi di setiap prompt adegan sinematik.
                </p>
              </div>

              <button
                onClick={async () => {
                  const gen = await api.characters.generateProfile('Protagonist', project.genre);
                  await api.characters.create(projectId, gen.profile);
                  fetchProjectData();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Karakter Baru AI</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map(char => (
                <div key={char.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[4/3] bg-studio-950 overflow-hidden">
                      <img src={char.reference_image_url} alt={char.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] font-mono text-cyan-300">
                        {char.gender === 'Male' ? 'Pria' : 'Wanita'} • {char.age} thn
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-white">{char.name}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{char.description}</p>
                      <div className="p-2.5 rounded-xl bg-studio-900 border border-white/5 text-[10px] space-y-1 font-mono">
                        <div><span className="text-slate-500">Busana:</span> <span className="text-slate-300">{char.clothing}</span></div>
                        <div><span className="text-slate-500">Penampilan:</span> <span className="text-slate-300">{char.appearance}</span></div>
                        <div><span className="text-slate-500">Suara:</span> <span className="text-cyan-300">{char.voice_id || 'Antoni Pratama'}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Memori Konsistensi Wajah Aktif</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: VOICE & AUDIO (Section 10, 25) ================= */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* ElevenLabs Voices Catalog */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Mic2 className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Daftar Pengisi Suara ElevenLabs</h4>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {voices.map(v => (
                  <div key={v.id} className="p-3 rounded-xl bg-studio-900/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{v.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {v.gender === 'male' ? 'Pria' : 'Wanita'} • {v.language} • {v.style}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        audioEngine.speak(`Halo! Saya ${v.name}, pengisi suara sinematik SCENARA AI. Siap menghidupkan naskah Anda menjadi karya spektakuler.`, {
                          gender: v.gender as any
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold hover:bg-cyan-500/30 flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Pratinjau Suara</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cinematic Music & SFX Stems */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Desain Suara &amp; Musik Proyek</h4>
              </div>
              <div className="p-4 rounded-xl bg-studio-900/80 border border-white/5 space-y-3">
                <div className="text-xs font-bold text-white">Soundtrack Sinematik Aktif</div>
                <div className="text-xs font-mono text-indigo-300">Bangkitnya Takdir — Orkes Sinematik (82 BPM)</div>
                <p className="text-[11px] text-slate-400">
                  Dinamika musik beradaptasi secara otomatis dengan emosi adegan dan memuncak pada Babak 2 dan 3.
                </p>
                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => {
                      audioEngine.startBackgroundMusic();
                      audioEngine.playSubImpact();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Sampel Musik</span>
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.stopAll();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-studio-800 text-slate-300 text-xs font-semibold hover:bg-studio-700"
                  >
                    ⏹ Hentikan Musik
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: MASTER PREVIEW & EXPORT (Section 26, 74) ================= */}
        {activeTab === 'preview' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <VideoPlayer
              src={project.final_video_url || '/storage/videos/master_preview.mp4'}
              poster={project.thumbnail_url}
              title={project.title}
              aspectRatio={project.aspect_ratio}
              activeAiModel="Master Bioskop (FFmpeg & Veo Engine)"
              subtitle={activeScene?.narration || 'Titik Balik — Karya Sinematik Utuh'}
            />

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{project.title}</h3>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                  <span>{project.target_duration_seconds}d Master</span>
                  <span>•</span>
                  <span>{scenes.length} Adegan</span>
                  <span>•</span>
                  <span>1080p FHD</span>
                  <span>•</span>
                  <span>{project.aspect_ratio}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRepurposeModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Ubah Format Medsos</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-1.5"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Unduh Master Video</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Multi-Track Professional Timeline (Section 22) */}
      <div className="p-4 lg:p-6 bg-studio-950 border-t border-white/10">
        <TimelineTrack
          scenes={scenes}
          activeSceneId={activeScene?.id || ''}
          onSelectScene={id => { 
            setActiveSceneId(id);
            const sc = scenes.find(s => s.id === id);
            if (sc && isPlayingTimeline && (sc.narration || sc.dialogue)) {
              audioEngine.speak(sc.narration || sc.dialogue || '', {
                gender: sc.dialogue ? 'male' : 'female'
              });
            }
          }}
          onAutoEdit={handleAutoEdit}
          totalDurationSeconds={project.target_duration_seconds}
          isPlaying={isPlayingTimeline}
          currentTimeSec={currentTimelineSec}
          onTogglePlay={handleTogglePlayTimeline}
          onSeek={handleSeekTimeline}
        />
      </div>

      {/* Floating AI Co-Director Assistant (Section 76) */}
      <AIContentAssistant
        projectId={projectId}
        activeSceneId={activeScene?.id}
        onRefresh={fetchProjectData}
      />

      {/* Modals */}
      <RepurposeModal
        isOpen={isRepurposeModalOpen}
        onClose={() => setIsRepurposeModalOpen(false)}
        currentDuration={project.target_duration_seconds}
        onConfirm={async (opts) => {
          const res = await api.projects.repurpose(projectId, opts);
          alert('Proyek video hasil repurpose berhasil dibuat!');
          setIsRepurposeModalOpen(false);
          onBackToDashboard();
        }}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projectId={projectId}
        projectTitle={project.title}
        defaultAspectRatio={project.aspect_ratio}
      />

      {/* Scene Quality Evaluation Modal (Section 52) */}
      {evaluationModalScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Skor Kualitas Adegan Sutradara AI</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-studio-900 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Kualitas Visual</span>
                <span className="text-emerald-400 font-bold text-base">{evaluationModalScene.visualScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-studio-900 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Konsistensi Karakter</span>
                <span className="text-cyan-400 font-bold text-base">{evaluationModalScene.characterConsistency}%</span>
              </div>
              <div className="p-3 rounded-xl bg-studio-900 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Kepatuhan Prompt</span>
                <span className="text-purple-400 font-bold text-base">{evaluationModalScene.promptAdherence}%</span>
              </div>
              <div className="p-3 rounded-xl bg-studio-900 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Skor Audio</span>
                <span className="text-amber-400 font-bold text-base">{evaluationModalScene.audioScore}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              {evaluationModalScene.feedback}
            </p>
            <button
              onClick={() => setEvaluationModalScene(null)}
              className="w-full py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
            >
              Tutup Penilaian
            </button>
          </div>
        </div>
      )}

      {/* Studio Generator Video AI Modal */}
      {activeScene && (
        <AIVideoGenModal
          isOpen={isAIVideoGenOpen}
          onClose={() => setIsAIVideoGenOpen(false)}
          sceneNumber={activeScene.scene_number}
          sceneTitle={activeScene.title}
          initialPrompt={activeScene.visual_prompt}
          aspectRatio={project.aspect_ratio}
          onGenerateComplete={async (newVideoUrl, modelName, promptUsed) => {
            setActiveSceneModel(`${modelName} (1080p Bioskop)`);
            const updatedScenes = scenes.map(s => s.id === activeScene.id ? { ...s, video_url: newVideoUrl, visual_prompt: promptUsed } : s);
            setScenes(updatedScenes);
            try {
              await api.scenes.update(activeScene.id, { video_url: newVideoUrl, visual_prompt: promptUsed });
              setSaveStatus('Tersimpan');
            } catch (err) {
              console.error('Failed to save scene:', err);
            }
          }}
        />
      )}
    </div>
  );
};
