import { IVideoProvider, IVoiceProvider, ILLMProvider, VideoGenerationOptions, VoiceGenerationOptions, ScriptGenerationOptions, AIPlanningResult, PlannedScene, PlannedCharacter } from './base.js';
import { PromptBuilder } from '../promptBuilder.js';
import { v4 as uuidv4 } from 'uuid';

export class MockVideoProvider implements IVideoProvider {
  public name = 'Veo / Runway Studio Engine (Simulated)';

  private cinematicVideoSamples = [
    '/storage/videos/scene_1.mp4',
    '/storage/videos/scene_2.mp4',
    '/storage/videos/scene_3.mp4',
    '/storage/videos/scene_4.mp4',
    '/storage/videos/scene_5.mp4',
    '/storage/videos/scene_6.mp4',
    '/storage/videos/scene_7.mp4',
    '/storage/videos/scene_8.mp4',
  ];

  public async generateVideo(options: VideoGenerationOptions): Promise<{ jobId: string; videoUrl?: string }> {
    const jobId = `job-${uuidv4()}`;
    const p = (options.prompt || '').toLowerCase();
    let videoUrl = this.cinematicVideoSamples[0];

    if (p.includes('pintu') || p.includes('kaca') || p.includes('evaluasi') || p.includes('adegan 03') || p.includes('adegan 3')) {
      videoUrl = '/storage/videos/scene_3.mp4';
    } else if (p.includes('sudirman') || p.includes('jalan') || p.includes('adegan 02') || p.includes('adegan 2')) {
      videoUrl = '/storage/videos/scene_2.mp4';
    } else if (p.includes('rapat') || p.includes('direksi') || p.includes('adegan 04') || p.includes('adegan 4')) {
      videoUrl = '/storage/videos/scene_4.mp4';
    } else if (p.includes('hujan') || p.includes('jpo') || p.includes('adegan 05') || p.includes('adegan 5')) {
      videoUrl = '/storage/videos/scene_5.mp4';
    } else if (p.includes('kopi') || p.includes('coding') || p.includes('adegan 06') || p.includes('adegan 6')) {
      videoUrl = '/storage/videos/scene_6.mp4';
    } else if (p.includes('jabat') || p.includes('nusa tech') || p.includes('adegan 07') || p.includes('adegan 7')) {
      videoUrl = '/storage/videos/scene_7.mp4';
    } else if (p.includes('rooftop') || p.includes('senja') || p.includes('adegan 08') || p.includes('adegan 8')) {
      videoUrl = '/storage/videos/scene_8.mp4';
    } else {
      const idx = Math.floor(Math.random() * this.cinematicVideoSamples.length);
      videoUrl = this.cinematicVideoSamples[idx];
    }

    return { jobId, videoUrl };
  }

  public async getGenerationStatus(jobId: string): Promise<{ status: 'queued' | 'processing' | 'completed' | 'failed'; progress: number; videoUrl?: string }> {
    return {
      status: 'completed',
      progress: 100,
      videoUrl: this.cinematicVideoSamples[0],
    };
  }

  public async cancelGeneration(jobId: string): Promise<boolean> {
    return true;
  }
}

export class MockVoiceProvider implements IVoiceProvider {
  public name = 'ElevenLabs Multilingual V2 (Simulated)';

  private sampleVoices = [
    '/storage/audio/voice_sample.wav',
    '/storage/audio/cinematic_theme.wav',
  ];

  public async generateVoice(options: VoiceGenerationOptions): Promise<{ audioUrl: string; duration: number }> {
    const words = options.text.trim().split(/\s+/).length;
    const duration = Math.max(3, Math.round((words / 2.5) * 10) / 10);
    const sample = this.sampleVoices[Math.floor(Math.random() * this.sampleVoices.length)];
    return {
      audioUrl: sample,
      duration,
    };
  }
}

export class MockLLMDirector implements ILLMProvider {
  public name = 'SCENARA AI Director (Core)';

  private stockVisuals = [
    '/storage/storyboards/scene_1.jpg',
    '/storage/storyboards/scene_2.jpg',
    '/storage/storyboards/scene_3.jpg',
    '/storage/storyboards/scene_4.jpg',
    '/storage/storyboards/scene_5.jpg',
    '/storage/storyboards/scene_6.jpg',
    '/storage/storyboards/scene_7.jpg',
    '/storage/storyboards/scene_8.jpg',
  ];

  public async planFilm(options: ScriptGenerationOptions): Promise<AIPlanningResult> {
    const totalSec = options.targetDurationSeconds;

    // Dynamically calculate scene breakdown based on total target duration
    // Average scene duration is typically 8-16 seconds in cinematic storytelling
    let sceneCount = 4;
    if (totalSec <= 15) sceneCount = 2;
    else if (totalSec <= 30) sceneCount = 3;
    else if (totalSec <= 60) sceneCount = 5;
    else if (totalSec <= 90) sceneCount = 6;
    else if (totalSec <= 120) sceneCount = 8;
    else if (totalSec <= 180) sceneCount = 10;
    else if (totalSec <= 300) sceneCount = 12;
    else sceneCount = Math.min(20, Math.max(12, Math.round(totalSec / 20)));

    // Distribute durationSeconds so sum equals exactly totalSec
    const baseDuration = Math.floor(totalSec / sceneCount);
    let remainder = totalSec - (baseDuration * sceneCount);

    const sceneDurations: number[] = [];
    for (let i = 0; i < sceneCount; i++) {
      let d = baseDuration;
      if (remainder > 0) {
        d += 1;
        remainder--;
      }
      sceneDurations.push(d);
    }

    // Characters definition (100% Bahasa Indonesia)
    const protagonist: PlannedCharacter = {
      name: 'Andrian Pratama',
      age: 24,
      gender: 'Male',
      role: 'Protagonis Utama',
      description: 'Pemuda berdaya juang tinggi yang menghadapi tekanan hidup keras di ibu kota dengan keyakinan, dedikasi, dan kecerdasan.',
      personality: 'Tangguh, reflektif, berani menghadapi tekanan besar, memiliki kepedulian mendalam terhadap keluarga.',
      appearance: 'Pria muda Indonesia, rambut hitam bergelombang rapi, kacamata kawat bulat, tatapan mata cokelat tajam penuh tekad.',
      clothing: 'Blazer biru dongker pas badan yang disetrika rapi, kemeja putih bersih berkerah tegak, celana panjang formal hitam.',
      voiceId: 'Antoni Pratama',
      referenceImageUrl: '/storage/characters/andrian_pratama.jpg',
    };

    const mentor: PlannedCharacter = {
      name: 'Maya Kusuma',
      age: 38,
      gender: 'Female',
      role: 'Sutradara / Mentor',
      description: 'Pemimpin eksekutif berpengalaman yang jeli mengenali kegigihan murni dan karakter sejati calon talenta terbaik.',
      personality: 'Berwawasan luas, tegas, berwibawa, namun tulus mengayomi dan membimbing bakat-bakat baru.',
      appearance: 'Potongan rambut bob hitam anggun berkilau, kacamata elegan, postur tubuh tegap dan percaya diri.',
      clothing: 'Setelan jas celana tailored arang modern dengan blus sutra berwarna krem.',
      voiceId: 'Aulia Kirana',
      referenceImageUrl: '/storage/storyboards/scene_4.jpg',
    };

    const sceneTemplates = [
      {
        title: 'Ambang Batas Sunyi',
        desc: 'Momen pembuka yang memperlihatkan pergulatan batin, kesunyian kamar sewa, dan tekad awal seorang pemuda.',
        loc: 'Kamar Kost Bersahaja / Fajar Jakarta',
        time: 'Fajar 05:30',
        mood: 'Melankolis, Kontemplatif, Sunyi',
        angle: 'Extreme Wide beralih ke Medium Push-In',
        move: 'Slow Dolly In',
        dialogue: '',
        narration: 'Setiap perjalanan besar selalu bermula dalam hening, di saat mimpi diuji antara padam atau membara.',
        action: 'Menatap layar laptop yang menyala di kegelapan kamar, menarik napas dalam-dalam sebelum memulai hari penentuan.',
        sfx: ['Gemuruh sayup kota Jakarta', 'Detak jam dinding', 'Hembusan angin jendela']
      },
      {
        title: 'Arus Perjuangan Kota',
        desc: 'Melangkah membelah lautan pekerja di jalanan protokol ibu kota, menggenggam erat visi masa depan.',
        loc: 'Kawasan Bisnis Sudirman',
        time: 'Pagi 08:00',
        mood: 'Dinamis, Menegangkan, Penuh Tekad',
        angle: 'Bidikan Rendah (Low Angle Tracking)',
        move: 'Dynamic Steadicam Tracking',
        dialogue: '',
        narration: 'Berjalan di antara ribuan langkah terburu-buru, mencari satu pintu yang terbuka untuk membuktikan kemampuan diri.',
        action: 'Melangkah mantap menembus kerumunan pejalan kaki, memegang amplop portofolio dengan gedung pencakar langit menjulang tinggi.',
        sfx: ['Deru kendaraan jalan raya', 'Langkah kaki berirama', 'Gemuruh kereta commuter']
      },
      {
        title: 'Pintu Masuk Ruang Evaluasi',
        desc: 'Berdiri tepat di depan pintu kaca buram ruang dewan direksi, bersiap melangkah masuk menghadapi panel evaluasi hidupnya.',
        loc: 'Lobi & Koridor Pintu Eksekutif Gedung Kaca',
        time: 'Siang 11:30',
        mood: 'Tegang, Mengintimidasi, Presisi',
        angle: 'Bidikan Sejajar Mata ke Gagang Pintu Kaca',
        move: 'Static Precision beralih ke Slow Push-In',
        dialogue: 'Kandidat nomor urut 12, Saudara Andrian Pratama, silakan masuk ke ruang panel evaluasi.',
        narration: 'Di balik pintu kaca ini, seluruh perjuangan dan pengorbanan dipertaruhkan. Tarik napas, dan langkahkan kaki.',
        action: 'Tangan menyentuh gagang pintu kaca buram, menarik napas mantap dengan pantulan sosok di kaca sebelum mendorong pintu masuk.',
        sfx: ['Dengung pendingin udara koridor', 'Gesekan halus gagang pintu chrome', 'Detak langkah percaya diri']
      },
      {
        title: 'Menembus Batas Malam',
        desc: 'Bekerja lembur melampaui rasa lelah di sebuah kedai kopi malam, menyempurnakan mahakarya teknologi.',
        loc: 'Kedai Kopi 24 Jam Bernuansa Hangat',
        time: 'Tengah Malam 01:00',
        mood: 'Hipnotis, Fokus Mendalam, Elektrik',
        angle: 'Over The Shoulder ke Rack Focus Keyboard',
        move: 'Subtle Handheld Micro-movement',
        dialogue: '',
        narration: 'Keahlian sejati lahir pada larut malam yang sunyi, saat tak ada seorang pun yang bertepuk tangan.',
        action: 'Jari-jemari mengetik cepat pada papan ketik, pantulan kode program menyinari wajah, menyeruput secangkir kopi hitam hangat.',
        sfx: ['Ketukan keyboard mekanik', 'Rintik hujan di kaca jendela', 'Gemuruh guntur lembut']
      },
      {
        title: 'Titik Balik Kesuksesan',
        desc: 'Momen terobosan krusial saat inovasi terbukti berhasil dan disambut tepuk tangan kehormatan pimpinan.',
        loc: 'Pusat Inovasi Teknologi Berlimpah Cahaya',
        time: 'Pagi 09:30',
        mood: 'Menginspirasi, Euforia, Membanggakan',
        angle: 'Medium Arc Two-Shot',
        move: 'Fluid 180-degree Arc Orbit',
        dialogue: 'Selamat bergabung di tim kami. Visi dan karya Anda persis seperti apa yang kami butuhkan.',
        narration: 'Dan akhirnya, semesta selalu membuka jalan bagi mereka yang tak pernah lelah mengetuk pintu keberhasilan.',
        action: 'Pendiri perusahaan tersenyum hangat dan menjabat tangan erat di bawah pendar sinar matahari pagi.',
        sfx: ['Tepuk tangan apresiasi', 'Harmoni orkestra membuncah', 'Akustik ruang hangat']
      },
      {
        title: 'Cakrawala Keemasan',
        desc: 'Resolusi emosional penuh kemenangan, memandang masa depan cerah dari atas atap gedung dengan rasa syukur.',
        loc: 'Pemandangan Atap Gedung Pencakar Langit',
        time: 'Senja Keemasan (Golden Hour)',
        mood: 'Epik, Katarsis, Megah Mengharukan',
        angle: 'Close-Up Heroik meluas ke Extreme Wide Crane',
        move: 'Boom Crane Rising Shot',
        dialogue: 'Ibu, aku berhasil membuktikannya.',
        narration: 'Harapan bukan sekadar janji kemudahan, melainkan keberanian untuk melangkah satu kali lagi.',
        action: 'Tersenyum bahagia menatap cakrawala jingga keemasan yang membentang luas tanpa batas.',
        sfx: ['Hembusan angin puncak gedung', 'Alunan melodi orkestra kemenangan', 'Dentang genta kejayaan']
      }
    ];

    const plannedScenes: PlannedScene[] = [];
    for (let i = 0; i < sceneCount; i++) {
      const template = sceneTemplates[i % sceneTemplates.length];
      const durationSec = sceneDurations[i];

      const visualPrompt = PromptBuilder.buildScenePrompt({
        userIdea: options.idea,
        visualStyle: options.visualStyle,
        cameraAngle: template.angle,
        cameraMovement: template.move,
        mood: template.mood,
        location: template.loc,
        timeOfDay: template.time,
        durationSeconds: durationSec,
        aspectRatio: options.aspectRatio,
        characters: [
          {
            name: protagonist.name,
            appearance: protagonist.appearance,
            clothing: protagonist.clothing,
            gender: protagonist.gender,
          }
        ],
        previousSceneSummary: i > 0 ? plannedScenes[i - 1].title : undefined,
        sceneAction: template.action,
      });

      plannedScenes.push({
        sceneNumber: i + 1,
        title: `Adegan ${String(i + 1).padStart(2, '0')}: ${template.title}`,
        description: template.desc,
        durationSeconds: durationSec,
        location: template.loc,
        timeOfDay: template.time,
        mood: template.mood,
        cameraAngle: template.angle,
        cameraMovement: template.move,
        visualPrompt,
        dialogue: template.dialogue || undefined,
        narration: template.narration || undefined,
        soundEffects: template.sfx,
      });
    }

    // Build screenplay text (100% Bahasa Indonesia)
    const scriptHeader = `SCENARA AI SUTRADARA — NASKAH SKENARIO RESMI
JUDUL: ${(options.idea || 'KARYA SINEMATIK INDONESIA').slice(0, 45).toUpperCase()}
GENRE: ${options.genre.toUpperCase()} | TARGET DURASI: ${Math.floor(totalSec / 60)}m ${totalSec % 60}s (${totalSec} detik)
BAHASA VISUAL: ${options.visualStyle} | RASIO ASPEK: ${options.aspectRatio}

BABAK I: AWAL PERCIKAN IMPIAN (PENGANTAR)
${plannedScenes.slice(0, Math.ceil(sceneCount * 0.3)).map(s => `ADEGAN ${s.sceneNumber} - ${s.location.toUpperCase()} - ${s.timeOfDay.toUpperCase()} (${s.durationSeconds}d)\n${s.description}\n${s.narration ? `NARASI (V.O.): "${s.narration}"\n` : ''}${s.dialogue ? `DIALOG: "${s.dialogue}"\n` : ''}`).join('\n')}

BABAK II: LABIRIN RINTANGAN & PERJUANGAN KERAS
${plannedScenes.slice(Math.ceil(sceneCount * 0.3), Math.ceil(sceneCount * 0.75)).map(s => `ADEGAN ${s.sceneNumber} - ${s.location.toUpperCase()} - ${s.timeOfDay.toUpperCase()} (${s.durationSeconds}d)\n${s.description}\n${s.narration ? `NARASI (V.O.): "${s.narration}"\n` : ''}${s.dialogue ? `DIALOG: "${s.dialogue}"\n` : ''}`).join('\n')}

BABAK III: TITIK BALIK & PUNCAK KEMENANGAN
${plannedScenes.slice(Math.ceil(sceneCount * 0.75)).map(s => `ADEGAN ${s.sceneNumber} - ${s.location.toUpperCase()} - ${s.timeOfDay.toUpperCase()} (${s.durationSeconds}d)\n${s.description}\n${s.narration ? `NARASI (V.O.): "${s.narration}"\n` : ''}${s.dialogue ? `DIALOG: "${s.dialogue}"\n` : ''}`).join('\n')}

[FADE OUT — TAMAT]`;

    return {
      title: options.idea ? (options.idea.split('.')[0].slice(0, 35) || 'Titik Balik Tak Terbatas') : 'Titik Balik Tak Terbatas',
      logline: 'Ketika dihadapkan pada rintangan hidup yang berat, jiwa pantang menyerah mengubah perjuangan sunyi menjadi karya kemenangan yang gemilang.',
      storyArc: {
        act1: 'Pengenalan tekad kuat, pergulatan batin menghadapi penolakan dan kesendirian di kota besar.',
        act2: 'Kegigihan tanpa henti dalam kesunyian malam, merajut karya inovatif melampaui keterbatasan.',
        act3: 'Puncak pembuktian di hadapan dunia dan terbukanya pintu masa depan penuh kebanggaan.'
      },
      totalPlannedDuration: totalSec,
      characters: [protagonist, mentor],
      scenes: plannedScenes,
      script: scriptHeader,
      musicRecommendation: {
        genre: 'Orkestra Modern Sinematik dengan Piano Hangat',
        tempo: '82 BPM',
        mood: 'Emosional, Menginspirasi, Penuh Semangat Kejayaan'
      }
    };
  }

  public async assistScript(content: string, action: string, instruction?: string): Promise<string> {
    if (action === 'make_cinematic') {
      return content + '\n\n[CATATAN SUTRADARA: Tingkatkan gerakan kamera push-in lambat saat klimaks adegan untuk memperdalam bobot emosional penonton.]';
    } else if (action === 'improve_dialogue') {
      return content.replace(/Pengalamanmu sedikit/g, 'Portofolio ini berani, namun standar industri kami menuntut ketangguhan jiwa');
    }
    return content + `\n\n[DISEMPURNAKAN OLEH SUTRADARA AI: Menyesuaikan nuansa untuk ${action} - ${instruction || 'Optimalisasi ritme dramatis'}]`;
  }

  public async evaluateScene(): Promise<{ visualScore: number; characterConsistency: number; promptAdherence: number; audioScore: number; feedback: string }> {
    return {
      visualScore: 96,
      characterConsistency: 94,
      promptAdherence: 98,
      audioScore: 93,
      feedback: 'Komposisi pembingkaian sinematik dan pencahayaan sangat harmonis. Konsistensi karakter dan intonasi emosional suara sangat kuat di seluruh adegan.'
    };
  }
}
