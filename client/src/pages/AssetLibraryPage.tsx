import React, { useState, useEffect } from 'react';
import { FolderKanban, UploadCloud, Film, Image as ImageIcon, Music, Trash2, Plus } from 'lucide-react';
import { Asset } from '../types/index.ts';
import { api } from '../services/api.ts';

export const AssetLibraryPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const fetchAssets = async () => {
    try {
      const data = await api.assets.list();
      setAssets(data.assets);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await api.assets.upload(file);
      fetchAssets();
    } catch (err: any) {
      alert('Gagal mengunggah berkas: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.assets.delete(id);
      setAssets(prev => prev.filter(a => a.id !== id));
    } catch {
      alert('Gagal menghapus aset');
    }
  };

  const filtered = assets.filter(a => filterType === 'all' || a.type === filterType);

  const filterLabels: Record<string, string> = {
    all: 'Semua Aset',
    video: 'Video',
    image: 'Gambar & Foto',
    audio: 'Musik & Audio'
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>PUSTAKA PENYIMPANAN ASET</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Pustaka Aset Produksi</h2>
          <p className="text-xs text-slate-400">
            Kumpulan rekaman video, foto referensi konsistensi karakter, trek musik latar, dan hasil ekspor master.
          </p>
        </div>

        {/* Upload Button */}
        <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center gap-2 transition-all shrink-0">
          <UploadCloud className="w-4 h-4" />
          <span>{isUploading ? 'Sedang Mengunggah...' : 'Unggah Berkas Media'}</span>
          <input type="file" onChange={handleFileUpload} className="hidden" accept="video/*,image/*,audio/*" />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'video', 'image', 'audio'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium uppercase font-mono transition-all ${
              filterType === t
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-studio-900 text-slate-400 border border-white/5 hover:text-white'
            }`}
          >
            {filterLabels[t] || t}
          </button>
        ))}
      </div>

      {/* Asset Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl border border-white/5 text-center text-slate-400">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-40 text-cyan-400" />
          <p className="text-xs">Belum ada aset media dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group">
              <div className="aspect-video bg-studio-950 flex items-center justify-center relative">
                {item.type === 'image' ? (
                  <img src={item.file_url} alt={item.name} className="w-full h-full object-cover" />
                ) : item.type === 'video' ? (
                  <Film className="w-8 h-8 text-cyan-400" />
                ) : (
                  <Music className="w-8 h-8 text-indigo-400" />
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-cyan-300 uppercase">
                  {item.type}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="truncate max-w-[140px] text-white font-medium">{item.name}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Hapus Aset"
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
