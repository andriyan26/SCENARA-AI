import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Settings2,
  Film
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  currentSceneLabel?: string;
  subtitle?: string;
  activeAiModel?: string;
  isPlayingControlled?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  aspectRatio = '16:9',
  currentSceneLabel,
  subtitle,
  activeAiModel = 'Google Veo 2.0 Bioskop',
  isPlayingControlled,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState(aspectRatio);

  useEffect(() => {
    setSelectedRatio(aspectRatio);
  }, [aspectRatio]);

  // Sync with timeline controlled playback
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlayingControlled === true) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(e => console.warn('Controlled play error:', e));
      }
    } else if (isPlayingControlled === false) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlayingControlled, src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video play issue, attempting local fallback:', err);
          if (videoRef.current) {
            videoRef.current.src = '/storage/videos/master_preview.mp4';
            videoRef.current.play().catch(e => console.error('Fallback play failed:', e));
          }
        });
      }
    }
  };

  const handleVideoError = () => {
    if (videoRef.current && !videoRef.current.src.includes('master_preview.mp4')) {
      console.warn('Video load error, falling back to local master_preview.mp4');
      videoRef.current.src = '/storage/videos/master_preview.mp4';
      videoRef.current.load();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);
    onTimeUpdate?.(curr, dur);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Aspect ratio wrapper styling
  const ratioClasses = {
    '16:9': 'aspect-video max-w-4xl',
    '9:16': 'aspect-[9/16] max-h-[580px] w-auto mx-auto',
    '1:1': 'aspect-square max-h-[520px] w-auto mx-auto',
    '4:5': 'aspect-[4/5] max-h-[540px] w-auto mx-auto',
  }[selectedRatio] || 'aspect-video max-w-4xl';

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-studio-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center group"
    >
      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Film className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white tracking-wide">
            {title || 'Layar Pratinjau SCENARA'}
          </span>
          {currentSceneLabel && (
            <span className="text-[10px] bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded font-mono">
              {currentSceneLabel}
            </span>
          )}
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] bg-black/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {activeAiModel}
          </span>
        </div>

        {/* Aspect Ratio Quick Toggles */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 pointer-events-auto">
          {(['16:9', '9:16', '1:1', '4:5'] as const).map(ratio => (
            <button
              key={ratio}
              onClick={() => setSelectedRatio(ratio)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
                selectedRatio === ratio
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Frame */}
      <div className={`relative w-full flex items-center justify-center bg-black ${ratioClasses}`}>
        <video
          ref={videoRef}
          src={src || '/storage/videos/master_preview.mp4'}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onError={handleVideoError}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
          playsInline
        />

        {/* Dynamic Cinematic Subtitles Overlay */}
        {subtitle && (
          <div className="absolute bottom-12 left-4 right-4 z-15 pointer-events-none flex justify-center text-center">
            <span className="px-3.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-amber-300 font-medium text-xs sm:text-sm tracking-wide shadow-2xl border border-amber-400/25 max-w-xl animate-fade-in-up">
              {subtitle}
            </span>
          </div>
        )}

        {/* Big Center Play Icon when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-black flex items-center justify-center shadow-xl shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-95 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="relative w-full flex items-center mb-2.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-1.5 transition-all"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button 
              onClick={() => { if (videoRef.current) videoRef.current.currentTime = 0; }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Putar ulang dari awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Timecode */}
            <div className="text-[11px] font-mono text-slate-300">
              <span className="text-cyan-300">{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <button onClick={toggleMute} className="text-slate-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hidden sm:block"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
              1080p FHD
            </span>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
