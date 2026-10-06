import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Plus, CheckCircle2, Mic2, Shirt, UserCheck, Trash2, X, RefreshCw } from 'lucide-react';
import { Character } from '../types/index.ts';
import { api } from '../services/api.ts';
import { audioEngine } from '../utils/audioEngine.ts';

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: 'char-andrian-1',
      project_id: 'a25a336c-b140-4f14-88b9-4420075ef4f9',
      name: 'Andrian Pratama',
      age: 24,
      gender: 'Male',
      description: 'Lulusan baru bidang Ilmu Komputer dari daerah, penuh tekad baja, introspektif, dan gigih berjuang di Jakarta.',
      appearance: 'Pria muda Indonesia, rambut hitam bergelombang rapi, tatapan mata cokelat tajam fokus, postur atletis tegap.',
      clothing: 'Jas blazer navy slim-fit rapi, kemeja putih berkerah licin, sepatu kulit formal hitam pantofel.',
      personality_traits: 'Pantang menyerah, analitis, tulus, rendah hati, berani mengambil risiko.',
      reference_image_url: '/storage/characters/andrian_pratama.jpg',
      voice_id: 'Antoni Pratama'
    },
    {
      id: 'char-maya-2',
      project_id: 'a25a336c-b140-4f14-88b9-4420075ef4f9',
      name: 'Maya Kusuma',
      age: 38,
      gender: 'Female',
      description: 'Pemimpin eksekutif senior perusahaan teknologi terkemuka. Cerdas, berwibawa, tajam menilai potensi sejati seseorang.',
      appearance: 'Wanita karir anggun, rambut bob hitam anggun sebahu, kacamata bingkai ramping elegan, senyum ramah berwibawa.',
      clothing: 'Setelan blazer abu-abu arang modern dengan blus sutra krem gading, arloji titanium minimalis.',
      personality_traits: 'Karismatik, lugas, visioner, adil, mengayomi talenta muda.',
      reference_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      voice_id: 'Maya Kusuma'
    },
    {
      id: 'char-budi-3',
      project_id: 'a25a336c-b140-4f14-88b9-4420075ef4f9',
      name: 'Budi Santoso',
      age: 48,
      gender: 'Male',
      description: 'Mentor senior berpengalaman dan pemilik kedai kopi malam tempat Andrian meracik prototipe software impiannya.',
      appearance: 'Pria paruh baya teduh dengan kumis tipis rapi, senyum hangat menenangkan, kerutan bijak di sekitar mata.',
      clothing: 'Kemeja flanel katun cokelat tua digulung sehasta, celemek barista kanvas hitam sederhana.',
      personality_traits: 'Bijaksana, suportif, pendengar yang baik, penuh nasehat hidup bermakna.',
      reference_image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
      voice_id: 'Budi Santoso'
    },
    {
      id: 'char-siti-4',
      project_id: 'a25a336c-b140-4f14-88b9-4420075ef4f9',
      name: 'Siti Rahma',
      age: 49,
      gender: 'Female',
      description: 'Ibunda tercinta Andrian di kampung halaman. Sumber kekuatan doa dan semangat terbesar dalam setiap perjuangan hidupnya.',
      appearance: 'Ibu bersahaja dengan senyum lembut penuh kasih sayang, kerudung pastel sederhana, pandangan mata penuh berkah.',
      clothing: 'Gamis batik tradisional motif bunga halus warna cokelat muda yang teduh dan bersahaja.',
      personality_traits: 'Penyayang, teguh dalam doa, penuh kehangatan keluarga, sabar tanpa batas.',
      reference_image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      voice_id: 'Siti Rahma'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChar, setNewChar] = useState({
    name: '',
    role: 'Protagonis',
    age: 25,
    gender: 'Male',
    clothing: '',
    description: '',
    voice_id: 'Antoni Pratama'
  });

  const handleCreate = () => {
    if (!newChar.name.trim()) {
      alert('Silakan masukkan nama karakter terlebih dahulu.');
      return;
    }

    const created: Character = {
      id: `char-${Date.now()}`,
      project_id: 'a25a336c-b140-4f14-88b9-4420075ef4f9',
      name: newChar.name,
      age: Number(newChar.age),
      gender: newChar.gender,
      description: newChar.description || `${newChar.role} penting dalam alur penceritaan sinematik.`,
      clothing: newChar.clothing || 'Busana kontemporer elegan yang konsisten di semua adegan.',
      appearance: 'Wajah berkarakter kuat dengan konsistensi visual identitas AI terjaga.',
      personality_traits: 'Karakter orisinal studio film SCENARA AI.',
      reference_image_url: newChar.gender === 'Male'
        ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      voice_id: newChar.voice_id
    };

    setCharacters(prev => [created, ...prev]);
    setIsModalOpen(false);
    setNewChar({
      name: '',
      role: 'Protagonis',
      age: 25,
      gender: 'Male',
      clothing: '',
      description: '',
      voice_id: 'Antoni Pratama'
    });
    alert(`Karakter ${created.name} berhasil dibuat dengan memori konsistensi visual aktif!`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus profil karakter ini?')) {
      setCharacters(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAudition = (char: Character) => {
    const text = `Halo, saya ${char.name}. Karakter saya telah dikunci dengan konsistensi wajah dan gaya suara bahasa Indonesia di setiap adegan film.`;
    audioEngine.speak(text, {
      gender: char.gender.toLowerCase() === 'female' ? 'female' : 'male'
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>STUDIO KONSISTENSI KARAKTER AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Studio Karakter Sinematik
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Teknologi memori identitas visual memastikan wajah, pakaian, bentuk rambut, dan ekspresi tokoh tetap sama persis di setiap babak dan prompt video.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Karakter AI Baru</span>
        </button>
      </div>

      {/* Grid of Characters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((char, index) => (
          <div
            key={char.id}
            style={{ animationDelay: `${index * 100}ms` }}
            className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group animate-fade-in-up"
          >
            <div>
              <div className="relative aspect-[4/3] bg-studio-950 overflow-hidden">
                <img
                  src={char.reference_image_url}
                  alt={char.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur border border-white/10 text-[10px] font-mono text-cyan-300">
                  {char.gender === 'Male' ? 'Pria' : 'Wanita'} • {char.age} Tahun
                </div>
                <button
                  onClick={() => handleDelete(char.id)}
                  title="Hapus Karakter"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-rose-500/80 text-slate-400 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2.5">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {char.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mt-0.5">
                    {char.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-studio-900/90 border border-white/5 text-[11px] space-y-1.5 font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <Shirt className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{char.clothing}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 truncate">
                    <Mic2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-amber-300 font-semibold">{char.voice_id || 'Antoni Pratama'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-3">
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Konsistensi Wajah 99.8%</span>
                </span>
              </div>

              <button
                onClick={() => handleAudition(char)}
                className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>Tes Bicara Karakter</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat Karakter Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in-up">
          <div className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Buat Profil Karakter AI Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Nama Karakter</label>
                <input
                  type="text"
                  placeholder="contoh: Dimas Anggara"
                  value={newChar.name}
                  onChange={e => setNewChar({ ...newChar, name: e.target.value })}
                  className="w-full px-3 py-2 bg-studio-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Peran Narasi</label>
                  <select
                    value={newChar.role}
                    onChange={e => setNewChar({ ...newChar, role: e.target.value })}
                    className="w-full px-2.5 py-2 bg-studio-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Protagonis">Protagonis Utama</option>
                    <option value="Antagonis">Antagonis</option>
                    <option value="Mentor">Mentor / Penasihat</option>
                    <option value="Pendamping">Karakter Pendukung</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={newChar.age}
                    onChange={e => setNewChar({ ...newChar, age: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-studio-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Gender</label>
                  <select
                    value={newChar.gender}
                    onChange={e => setNewChar({ ...newChar, gender: e.target.value })}
                    className="w-full px-2.5 py-2 bg-studio-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Male">Pria</option>
                    <option value="Female">Wanita</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Deskripsi & Kepribadian</label>
                <textarea
                  rows={2}
                  placeholder="Latar belakang karakter, sifat dominan, tujuan hidup..."
                  value={newChar.description}
                  onChange={e => setNewChar({ ...newChar, description: e.target.value })}
                  className="w-full p-2.5 bg-studio-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Pakaian Utama (Wardrobe)</label>
                <input
                  type="text"
                  placeholder="contoh: Jaket bomber hitam dengan kaos putih dan celana jeans gelap"
                  value={newChar.clothing}
                  onChange={e => setNewChar({ ...newChar, clothing: e.target.value })}
                  className="w-full px-3 py-2 bg-studio-900 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Pengisi Suara Terkait</label>
                <select
                  value={newChar.voice_id}
                  onChange={e => setNewChar({ ...newChar, voice_id: e.target.value })}
                  className="w-full px-3 py-2 bg-studio-900 border border-white/10 rounded-xl text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
                >
                  <option value="Antoni Pratama">Antoni Pratama (Pria Muda Dinamis)</option>
                  <option value="Budi Santoso">Budi Santoso (Pria Dewasa Hangat)</option>
                  <option value="Reza Mahendra">Reza Mahendra (Bariton Trailer Bioskop)</option>
                  <option value="Dimas Danendra">Dimas Danendra (Formal Penyiaran)</option>
                  <option value="Maya Kusuma">Maya Kusuma (Wanita Karismatik)</option>
                  <option value="Siti Rahma">Siti Rahma (Wanita Empatik & Lembut)</option>
                  <option value="Putri Ayu">Putri Ayu (Wanita Muda Ceria)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20"
              >
                Simpan Karakter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
