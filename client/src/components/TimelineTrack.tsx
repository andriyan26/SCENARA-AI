import React, { useRef } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Music, 
  MessageSquare, 
  Layers, 
  Clock,
  RotateCcw
} from 'lucide-react';
import { Scene } from '../types/index.ts';

interface TimelineTrackProps {
  scenes: Scene[];
  activeSceneId: string;
  onSelectScene: (sceneId: string) => void;
  onAutoEdit?: () => void;
  totalDurationSeconds?: number;
  isPlaying?: boolean;
  currentTimeSec?: number;
  onTogglePlay?: () => void;
  onSeek?: (sec: number) => void;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({
  scenes,
  activeSceneId,
  onSelectScene,
  onAutoEdit,
  totalDurationSeconds = 120,
  isPlaying = false,
  currentTimeSec = 0,
  onTogglePlay,
  onSeek
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const totalCalculated = scenes.reduce((acc, s) => acc + (s.duration_seconds || 10), 0) || totalDurationSeconds;

  // Calculate cumulative start times for scenes
  let accumulated = 0;
  const sceneTimelineMap = scenes.map(s => {
    const start = accumulated;
    const dur = s.duration_seconds || 10;
    accumulated += dur;
    return {
      scene: s,
      start,
      end: start + dur,
      duration: dur,
    };
  });

  const progressPercent = Math.min(100, Math.max(0, (currentTimeSec / totalCalculated) * 100));

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !onSeek) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = ratio * totalCalculated;
    onSeek(targetSec);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-studio-950/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none">
      {/* Timeline Action Header */}
      <div className="px-4 py-2.5 bg-studio-900/90 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Main Play / Pause Timeline Button */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Jeda Garis Waktu</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Putar Garis Waktu</span>
              </>
            )}
          </button>

          {/* Timecode & Playhead Display */}
          <div className="flex items-center gap-2 text-xs font-mono pl-3 border-l border-white/10">
            <span className="text-cyan-300 font-bold text-sm">{formatTime(currentTimeSec)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(totalCalculated)}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 text-[11px] font-mono">({scenes.length} Adegan)</span>
          </div>
        </div>

        {/* AI Auto Editor Button & Reset */}
        <div className="flex items-center gap-2">
          {onSeek && (
            <button
              onClick={() => onSeek(0)}
              title="Kembalikan penunjuk waktu ke awal"
              className="p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {onAutoEdit && (
            <button
              onClick={onAutoEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold hover:border-purple-400 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
              <span>Edit Otomatis AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrub Ruler Bar */}
      <div 
        onClick={handleTimelineClick}
        className="relative h-6 bg-studio-900 border-b border-white/10 px-3 flex items-center cursor-pointer group"
      >
        <div className="w-full flex justify-between text-[9px] font-mono text-slate-500">
          <span>00:00</span>
          <span>{formatTime(totalCalculated * 0.25)}</span>
          <span>{formatTime(totalCalculated * 0.5)}</span>
          <span>{formatTime(totalCalculated * 0.75)}</span>
          <span>{formatTime(totalCalculated)}</span>
        </div>

        {/* Global Progress Fill */}
        <div 
          className="absolute top-0 bottom-0 left-0 bg-cyan-500/10 pointer-events-none transition-all"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Red Playhead Indicator */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-lg shadow-rose-500/80 z-30 pointer-events-none transition-all duration-75"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-2.5 h-2.5 -ml-1 -mt-0.5 bg-rose-500 rounded-full shadow" />
        </div>
      </div>

      {/* Multi-Track Workspace */}
      <div 
        ref={timelineRef}
        className="p-4 space-y-2.5 overflow-x-auto relative"
      >
        {/* Playhead Guide Line crossing all tracks */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-rose-500/80 z-20 pointer-events-none transition-all duration-75"
          style={{ left: `calc(120px + (100% - 136px) * ${progressPercent / 100})` }}
        />

        {/* Track 1: VIDEO TRACK */}
        <div className="flex items-center gap-3 min-w-[700px]">
          <div className="w-28 shrink-0 flex items-center gap-2 text-[11px] font-mono text-cyan-400 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>TREK VIDEO</span>
          </div>
          <div className="flex-1 flex gap-1.5 p-1 bg-studio-900/60 rounded-xl border border-white/5 relative">
            {sceneTimelineMap.map(({ scene, start, end, duration }) => {
              const isSelected = scene.id === activeSceneId;
              const isCurrentlyPlaying = isPlaying && currentTimeSec >= start && currentTimeSec < end;
              const widthWeight = Math.max(75, (duration / totalCalculated) * 600);

              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    onSelectScene(scene.id);
                    if (onSeek) onSeek(start);
                  }}
                  style={{ minWidth: `${widthWeight}px` }}
                  className={`relative flex-1 h-14 rounded-lg p-2 flex flex-col justify-between cursor-pointer border transition-all ${
                    isCurrentlyPlaying
                      ? 'bg-cyan-900/90 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-[1.02] z-10 ring-2 ring-cyan-400'
                      : isSelected
                      ? 'bg-cyan-950/70 border-cyan-500/60'
                      : 'bg-studio-800/80 border-white/10 hover:border-white/30 hover:bg-studio-750'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-white truncate">ADEGAN {String(scene.scene_number).padStart(2, '0')}</span>
                    <span className="font-mono text-cyan-300 bg-black/60 px-1 rounded">{duration}d</span>
                  </div>
                  <p className="text-[9px] text-slate-300 truncate">{scene.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: VOICE & DIALOGUE TRACK */}
        <div className="flex items-center gap-3 min-w-[700px]">
          <div className="w-28 shrink-0 flex items-center gap-2 text-[11px] font-mono text-amber-400 font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>TREK SUARA</span>
          </div>
          <div className="flex-1 flex gap-1.5 p-1 bg-studio-900/60 rounded-xl border border-white/5">
            {sceneTimelineMap.map(({ scene, start, end, duration }) => {
              const isSpeakingNow = isPlaying && currentTimeSec >= start && currentTimeSec < end;
              const hasVoice = Boolean(scene.narration || scene.dialogue);

              return (
                <div
                  key={`voice-${scene.id}`}
                  onClick={() => {
                    onSelectScene(scene.id);
                    if (onSeek) onSeek(start);
                  }}
                  className={`flex-1 h-8 rounded-lg px-2 flex items-center justify-between text-[10px] cursor-pointer transition-all ${
                    isSpeakingNow && hasVoice
                      ? 'bg-amber-500/30 border border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                      : hasVoice
                      ? 'bg-amber-950/40 border border-amber-500/20 text-amber-300'
                      : 'bg-studio-900 border border-white/5 text-slate-500'
                  }`}
                >
                  <span className="truncate">
                    {scene.narration ? '🎙️ Narasi' : scene.dialogue ? '💬 Dialog' : '— Sunyi —'}
                  </span>
                  <span className="font-mono text-[9px] text-amber-400">{duration}d</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 3: MUSIC TRACK */}
        <div className="flex items-center gap-3 min-w-[700px]">
          <div className="w-28 shrink-0 flex items-center gap-2 text-[11px] font-mono text-indigo-400 font-semibold">
            <Music className="w-3.5 h-3.5" />
            <span>TREK MUSIK</span>
          </div>
          <div className="flex-1 h-8 rounded-xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-indigo-950/80 border border-indigo-500/30 px-3 flex items-center justify-between text-[10px] text-indigo-200">
            <span className="flex items-center gap-2 font-mono">
              <span className={`w-2 h-2 rounded-full bg-indigo-400 ${isPlaying ? 'animate-ping' : ''}`} />
              Bangkitnya Takdir (Orkestra Sinematik • 82 BPM)
            </span>
            <span className="font-mono text-[9px] text-indigo-300">Berkesinambungan {totalCalculated}d</span>
          </div>
        </div>

        {/* Track 4: SFX TRACK */}
        <div className="flex items-center gap-3 min-w-[700px]">
          <div className="w-28 shrink-0 flex items-center gap-2 text-[11px] font-mono text-emerald-400 font-semibold">
            <Volume2 className="w-3.5 h-3.5" />
            <span>TREK SFX</span>
          </div>
          <div className="flex-1 flex gap-2 p-1 bg-studio-900/60 rounded-xl border border-white/5">
            <div className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] text-emerald-300 font-mono">
              🌧️ Hujan & Petir Jakarta
            </div>
            <div className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] text-emerald-300 font-mono">
              🚗 Gemuruh Kota
            </div>
            <div className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] text-emerald-300 font-mono">
              ⌨️ Ketikan Larut Malam
            </div>
            <div className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[9px] text-emerald-300 font-mono">
              💥 Dentuman Sub-Bass
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
