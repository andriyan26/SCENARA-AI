// SCENARA AI — Comprehensive Studio Audio & Speech Engine
// Combines Web Audio API Synth, SpeechSynthesis, and HTML5 Audio

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private musicSource: AudioNode | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private bgAudioElement: HTMLAudioElement | null = null;
  private synthLoopId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Play Background Music (Orchestral Cinematic Theme)
  public startBackgroundMusic(volume = 0.45) {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // First attempt HTML5 audio from server storage
    try {
      if (!this.bgAudioElement) {
        this.bgAudioElement = new Audio('/storage/audio/cinematic_theme.wav');
        this.bgAudioElement.loop = true;
      }
      this.bgAudioElement.volume = volume;
      const playPromise = this.bgAudioElement.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Fallback to Web Audio synthesis if autoplay or fetch issue occurs
          this.startSynthesizedScore(volume);
        });
      }
    } catch {
      this.startSynthesizedScore(volume);
    }
  }

  // Pure Web Audio synthesized cinematic chord progression (zero network failure)
  private startSynthesizedScore(volume = 0.35) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(volume, ctx.currentTime);
    this.musicGain.connect(ctx.destination);

    // Chords: C minor, Ab major, Eb major, Bb major
    const chordFrequencies = [
      [130.81, 155.56, 196.00], // C3, Eb3, G3
      [103.83, 130.81, 155.56], // Ab2, C3, Eb3
      [155.56, 196.00, 233.08], // Eb3, G3, Bb3
      [116.54, 146.83, 174.61], // Bb2, D3, F3
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      const now = this.ctx.currentTime;
      const chord = chordFrequencies[chordIdx % chordFrequencies.length];
      chordIdx++;

      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Soft attack and decay envelope
        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.exponentialRampToValueAtTime(0.12, now + 0.8);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(oscGain);
        oscGain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + 4.0);
      });

      this.synthLoopId = window.setTimeout(playNextChord, 3800);
    };

    playNextChord();
  }

  // Duck music when speech plays
  public duckMusic(duck = true) {
    if (this.bgAudioElement) {
      this.bgAudioElement.volume = duck ? 0.15 : 0.45;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(duck ? 0.08 : 0.35, this.ctx.currentTime);
    }
  }

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.bgAudioElement) {
      this.bgAudioElement.pause();
      this.bgAudioElement.currentTime = 0;
    }
    if (this.synthLoopId) {
      clearTimeout(this.synthLoopId);
      this.synthLoopId = null;
    }
  }

  // 2. Play Foley & Impact Sound Effects
  public playSubImpact() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.8);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  public playWhoosh() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 3. Human Speech Synthesis (Bahasa Indonesia Voice Acting)
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public speak(text: string, options: { 
    gender?: 'male' | 'female'; 
    voiceName?: string;
    onEnd?: () => void; 
    rate?: number;
    pitch?: number;
  } = {}) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Focus 100% on Indonesian phonetics
    utterance.rate = options.rate || 0.95; // Natural deliberate cinematic pacing
    utterance.pitch = options.pitch ?? (options.gender === 'female' ? 1.12 : 0.88);

    // Refresh voices list if not loaded yet
    if (this.cachedVoices.length === 0) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }

    // 1. Search for dedicated Indonesian voices
    let selectedVoice = this.cachedVoices.find(v => 
      v.lang.toLowerCase() === 'id-id' || 
      v.lang.toLowerCase().startsWith('id') || 
      v.name.toLowerCase().includes('indonesia') ||
      v.name.toLowerCase().includes('gadis') ||
      v.name.toLowerCase().includes('ardi')
    );

    // 2. Gender refinement if Indonesian voice with gender exists
    if (options.gender === 'female') {
      const femaleIdVoice = this.cachedVoices.find(v => 
        (v.lang.toLowerCase().includes('id') || v.name.toLowerCase().includes('indonesia')) &&
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('gadis') || v.name.toLowerCase().includes('siti'))
      );
      if (femaleIdVoice) selectedVoice = femaleIdVoice;
    } else if (options.gender === 'male') {
      const maleIdVoice = this.cachedVoices.find(v => 
        (v.lang.toLowerCase().includes('id') || v.name.toLowerCase().includes('indonesia')) &&
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ardi') || v.name.toLowerCase().includes('budi'))
      );
      if (maleIdVoice) selectedVoice = maleIdVoice;
    }

    // 3. Fallback to natural multilingual voice if native ID voice pack is absent on host OS
    if (!selectedVoice) {
      selectedVoice = this.cachedVoices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Microsoft')
      ) || this.cachedVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    this.duckMusic(true);

    utterance.onend = () => {
      this.duckMusic(false);
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.duckMusic(false);
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.duckMusic(false);
    }
  }

  public stopAll() {
    this.stopBackgroundMusic();
    this.stopSpeech();
  }
}

export const audioEngine = new StudioAudioEngine();

