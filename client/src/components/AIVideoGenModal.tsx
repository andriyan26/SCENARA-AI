import React, { useState } from 'react';
import { 
  Clapperboard, 
  Sparkles, 
  Sliders, 
  Video, 
  CheckCircle2, 
  X, 
  Cpu, 
  Layers, 
  Camera, 
  RefreshCw,
  Film,
  Zap,
  Play
} from 'lucide-react';

interface AIVideoGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneNumber: number;
  sceneTitle: string;
  initialPrompt: string;
  aspectRatio?: string;
  onGenerateComplete: (newVideoUrl: string, modelName: string, promptUsed: string) => void;
}

export const AIVideoGenModal: React.FC<AIVideoGenModalProps> = ({
  isOpen,
  onClose,
  sceneNumber,
  sceneTitle,
  initialPrompt,
  aspectRatio = '16:9',
  onGenerateComplete,
}) => {
  const [selectedModel, setSelectedModel] = useState('veo-2.0');
  const [cameraMotion, setCameraMotion] = useState('Dolly In Sinematik');
  const [motionIntensity, setMotionIntensity] = useState(6);
  const [fps, setFps] = useState('24 FPS (Bioskop)');
  const [promptText, setPromptText] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  if (!isOpen) return null;

  const aiModels = [
    {
      id: 'veo-2.0',
      name: 'Google Veo 2.0',
      desc: 'Mesin bioskop 1080p/4K resmi Google, konsistensi fisika dan pencahayaan terbaik',
      badge: 'Rekomendasi Utama',
      color: 'border-cyan-400/50 bg-cyan-950/40 text-cyan-300'
    },
    {
      id: 'runway-gen3',
      name: 'Runway Gen-3 Alpha',
      desc: 'Fotorealistik tinggi dengan simulasi gerakan kamera bebas tanpa distorsi',
      badge: 'Fotorealistik',
      color: 'border-purple-400/50 bg-purple-950/40 text-purple-300'
    },
    {
      id: 'sora-cine',
      name: 'OpenAI Sora Cine',
      desc: 'Generasi adegan naratif kompleks dengan pemahaman mendalam geometri dunia',
      badge: 'Simulasi Lanjutan',
      color: 'border-emerald-400/50 bg-emerald-950/40 text-emerald-300'
    },
    {
      id: 'luma-dream',
      name: 'Luma Dream Machine',
      desc: 'Transisi gerakan ekstra mulus 60 FPS dengan kedalaman ruang sinematik',
      badge: 'Ultra Mulus',
      color: 'border-amber-400/50 bg-amber-950/40 text-amber-300'
    }
  ];

  const handleEnhancePrompt = () => {
    const additions = ' Rekaman kamera lensa prima 35mm anamorfik, kedalaman ruang dangkal sinematik, butiran film alami 8k, pencahayaan volumetrik moody teal dan warm amber, gerakan stabil tanpa goyangan, kualitas layar perak festival film.';
    if (!promptText.includes('lensa prima 35mm')) {
      setPromptText(prev => prev.trim() + additions);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenStep(1); // 20% Analisis naskah

    await new Promise(r => setTimeout(r, 900));
    setGenStep(2); // 50% Difusi Spasio-Temporal

    await new Promise(r => setTimeout(r, 1100));
    setGenStep(3); // 80% Konsistensi Karakter & Interpolasi Gerak

    await new Promise(r => setTimeout(r, 1000));
    setGenStep(4); // 100% Finalisasi Render H.264

    await new Promise(r => setTimeout(r, 600));

    // Choose appropriate video URL matching the scene or prompt
    let resultVideo = `/storage/videos/scene_${sceneNumber}.mp4`;
    if (sceneNumber < 1 || sceneNumber > 8) {
      resultVideo = `/storage/videos/scene_3.mp4`;
    }

    const modelName = aiModels.find(m => m.id === selectedModel)?.name || 'Google Veo 2.0';
    setIsGenerating(false);
    onGenerateComplete(resultVideo, modelName, promptText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in-up select-none">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  Studio Generasi Video AI Sinematik
                </h3>
                <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                  Adegan {String(sceneNumber).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pilih mesin model AI video neural, sesuaikan pergerakan kamera, dan render video definisi tinggi.
              </p>
            </div>
          </div>

          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        {isGenerating ? (
          /* Real-time Generation Progress View */
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-studio-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/30 animate-spin">
                <Cpu className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h4 className="text-base font-bold text-white font-display">
                {genStep === 1 && 'Tahap 1/4: Menguraikan Prompt & Parameter Gerakan Kamera...'}
                {genStep === 2 && 'Tahap 2/4: Menjalankan Difusi Spasio-Temporal Video AI...'}
                {genStep === 3 && 'Tahap 3/4: Mempertahankan Konsistensi Wajah & Sudut Sinematik...'}
                {genStep === 4 && 'Tahap 4/4: Mengompilasi Berkas H.264 Resolusi 1080p FHD...'}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Model: <span className="text-cyan-300">{aiModels.find(m => m.id === selectedModel)?.name}</span> • Durasi: 15 detik • Format: {aspectRatio}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-studio-900 rounded-full h-2.5 overflow-hidden border border-white/10">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${genStep * 25}%` }}
              />
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{genStep * 25}% Selesai</span>
          </div>
        ) : (
          /* Form Controls */
          <div className="space-y-6">
            {/* 1. Pilih Model AI Video */}
            <div>
              <label className="text-xs font-bold text-white mb-2.5 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Pilih Mesin Generator AI Video</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiModels.map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      selectedModel === model.id
                        ? `${model.color} shadow-lg ring-1 ring-cyan-400`
                        : 'bg-studio-900/70 border-white/10 hover:border-white/30 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{model.name}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{model.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Pengaturan Kamera & Intensitas Gerakan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-studio-900/60 border border-white/10">
              {/* Kamera */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kamera AI</span>
                </label>
                <select
                  value={cameraMotion}
                  onChange={e => setCameraMotion(e.target.value)}
                  className="w-full bg-studio-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Dolly In Sinematik">Dolly Lambat Maju (Slow Push-In)</option>
                  <option value="Steadicam Tracking">Pelacakan Steadicam Dinamis</option>
                  <option value="Static Precision">Presisi Statis Sinema</option>
                  <option value="Subtle Handheld">Handheld Halus Organik</option>
                  <option value="Orbital 360">Orbit Melingkar 180°</option>
                  <option value="Crane Rising">Crane Naik ke Cakrawala</option>
                </select>
              </div>

              {/* Intensitas Gerakan Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>Kekuatan Gerak AI</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">{motionIntensity} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={motionIntensity}
                  onChange={e => setMotionIntensity(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                  <span>Halus</span>
                  <span>Sedang</span>
                  <span>Dinamis</span>
                </div>
              </div>

              {/* Framerate */}
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Laju Bingkai (FPS)</span>
                </label>
                <select
                  value={fps}
                  onChange={e => setFps(e.target.value)}
                  className="w-full bg-studio-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="24 FPS (Bioskop)">24 FPS (Standar Bioskop)</option>
                  <option value="30 FPS (Medsos)">30 FPS (Medsos & Layar Web)</option>
                  <option value="60 FPS (Ultra Halus)">60 FPS (Gerakan Halus)</option>
                </select>
              </div>
            </div>

            {/* 3. Prompt Visual Sinematik */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Prompt Visual Sinematik (Bahasa Indonesia)</span>
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Tingkatkan Prompt Otomatis</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                className="w-full bg-studio-900 border border-white/10 rounded-2xl p-3.5 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-cyan-400 resize-none"
                placeholder="Tuliskan arahan visual sinematik adegan dalam Bahasa Indonesia..."
              />
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-studio-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-studio-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartGeneration}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Render Video AI ({aiModels.find(m => m.id === selectedModel)?.name})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
