import { PlannedCharacter } from './providers/base.js';

export interface PromptBuilderInput {
  userIdea?: string;
  visualStyle: string;
  cameraAngle: string;
  cameraMovement: string;
  mood: string;
  location: string;
  timeOfDay: string;
  durationSeconds: number;
  aspectRatio: string;
  characters?: Array<{
    name: string;
    appearance: string;
    clothing: string;
    gender: string;
  }>;
  previousSceneSummary?: string;
  sceneAction: string;
}

export class PromptBuilder {
  /**
   * Membangun prompt sinematik standar industri kelas atas untuk model video generatif (Google Veo 2.0 / Runway Gen-3)
   * 100% menggunakan Bahasa Indonesia sinematik dengan arahan kamera, pencahayaan, dan konsistensi karakter.
   */
  public static buildScenePrompt(input: PromptBuilderInput): string {
    const parts: string[] = [];

    // 1. Format Rasio & Gaya Sinematik
    const ratioDesc = input.aspectRatio === '9:16' ? 'layar vertikal sinematik 9:16' : 'layar lebar sinematik 16:9';
    parts.push(`Bidikan master sinematik bermutu bioskop (${ratioDesc}), gaya visual ${input.visualStyle}`);

    // 2. Arahan Pergerakan Kamera & Lensa
    const cameraDirectives = `${input.cameraAngle}, ${input.cameraMovement}, lensa anamorfik sinematik 35mm, kedalaman ruang dangkal (shallow depth of field), fokus tajam fotorealistik`;
    parts.push(`Kamera: ${cameraDirectives}`);

    // 3. Suasana, Latar Tempat, dan Tata Cahaya
    parts.push(`Latar & Pencahayaan: ${input.location} saat ${input.timeOfDay}, nuansa suasana ${input.mood}, pencahayaan volumetrik alami berbobot sinematik`);

    // 4. Konsistensi Karakter & Busana
    if (input.characters && input.characters.length > 0) {
      const charDescriptions = input.characters
        .map(c => `${c.name} (${c.appearance}, mengenakan ${c.clothing})`)
        .join(' berdampingan dengan ');
      parts.push(`Subjek Tokoh: ${charDescriptions}`);
    }

    // 5. Aksi & Dinamika Emosional Adegan
    parts.push(`Aksi Karakter: ${input.sceneAction}`);

    // 6. Kontinuitas Alur dari Adegan Sebelumnya
    if (input.previousSceneSummary) {
      parts.push(`Kontinuitas: transisi mulus dan berkesinambungan dari adegan sebelumnya ("${input.previousSceneSummary}")`);
    }

    // 7. Parameter Kualitas Resolusi & Gradasi Warna Bioskop
    parts.push(`Sentuhan Sinematografi: Gradasi warna filmik moody teal & amber, butiran film alami, mahakarya visual bioskop, resolusi ultra 8k, tekstur fotorealistik, pergerakan kamera stabil bertenaga`);

    return parts.join('. ') + '.';
  }

  /**
   * Generator prompt khusus keyframe ilustrasi papan cerita (storyboard)
   */
  public static buildStoryboardPrompt(scenePrompt: string): string {
    return `Konsep seni visual produksi film profesional, frame ilustrasi storyboard sinematik beresolusi tinggi: ${scenePrompt}. Desain produksi artistik, pencahayaan ekspresif dramatis.`;
  }
}
