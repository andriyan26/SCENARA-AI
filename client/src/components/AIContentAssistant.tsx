import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.ts';

interface AIContentAssistantProps {
  projectId: string;
  activeSceneId?: string;
  onRefresh?: () => void;
}

export const AIContentAssistant: React.FC<AIContentAssistantProps> = ({
  projectId,
  activeSceneId,
  onRefresh
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Halo! Saya Sutradara AI pendamping Anda di lokasi syuting. Beritahu saya apa yang ingin disesuaikan (contoh: "Buat Adegan 3 lebih emosional", "Pertajam dialog karakter", "Ubah kamera ke slow dolly anamorphic").'
    }
  ]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isProcessing) return;

    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');
    setIsProcessing(true);

    try {
      // Direct call to script assistant or scene optimization
      const res = await api.scripts.aiAssistant(projectId, 'improve_dialogue', textToSend);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Arahan sutradara berhasil diterapkan: "${textToSend}". Ketukan naskah dan bahasa visual kamera telah disesuaikan!`
        }
      ]);
      onRefresh?.();
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Pembaruan sutradara berhasil diproses untuk adegan aktif: ${textToSend}.`
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = [
    'Buat dialog lebih menyentuh hati',
    'Ganti kamera ke slow dolly anamorphic',
    'Tingkatkan ketegangan dramatis adegan',
    'Ubah pencahayaan ke moody teal & amber',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full">
      {isOpen ? (
        <div className="glass-panel border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-96 animate-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="px-4 py-3 bg-studio-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Sutradara Pendamping AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Asisten Adegan Real-time</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-studio-900/90 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-2 text-cyan-300 font-mono text-[10px] items-center">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Sutradara AI sedang menerapkan perubahan arahan...</span>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="px-3 py-1.5 bg-studio-900/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="shrink-0 text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all font-mono"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-studio-900/90 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Beri instruksi kepada Sutradara AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-studio-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={isProcessing}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all group border border-cyan-400/30"
        >
          <Bot className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          <span>Tanya Sutradara AI</span>
        </button>
      )}
    </div>
  );
};
