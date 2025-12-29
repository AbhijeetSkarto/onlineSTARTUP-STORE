
import React, { useState, useEffect } from 'react';
import { 
  generateAIText, 
  generateImagePro, 
  searchGrounding, 
  generateSpeech, 
  generateVideoVeo,
  editImage
} from '../services/gemini';

interface InteractiveDemosProps {
  initialView?: 'chat' | 'image' | 'voice' | 'search' | 'video' | 'edit' | 'live';
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function createWavHeader(pcmLength: number, sampleRate: number): Uint8Array {
  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x52494646, false); view.setUint32(4, 36 + pcmLength, true); view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false); view.setUint32(40, pcmLength, true);
  return header;
}

export const InteractiveDemos: React.FC<InteractiveDemosProps> = ({ initialView = 'chat' }) => {
  const [activeTab, setActiveTab] = useState(initialView);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [useThinking, setUseThinking] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const executeAction = async () => {
    if (!input && activeTab !== 'live') return;
    setLoading(true);
    setResult(null);

    try {
      if (activeTab === 'chat') {
        setLoadingMsg('Pro: Logical Reasoning in progress...');
        const res = await generateAIText(input, true, useThinking);
        setResult(res);
      } else if (activeTab === 'image') {
        setLoadingMsg(`Pro Image: Synthesizing ${imageSize} Visual...`);
        const res = await generateImagePro(input, aspectRatio, imageSize);
        setResult(res);
      } else if (activeTab === 'video') {
        setLoadingMsg('Veo 3.1: Rendering cinematic sequence...');
        const res = await generateVideoVeo(input, aspectRatio === '9:16' ? '9:16' : '16:9', uploadedImage?.split(',')[1]);
        setResult(res);
      } else if (activeTab === 'edit') {
        if (!uploadedImage) throw new Error("Reference required.");
        setLoadingMsg('Nano Banana: Regenerating Image...');
        const res = await editImage(uploadedImage.split(',')[1], input);
        setResult(res);
      } else if (activeTab === 'search') {
        setLoadingMsg('Search Grounding: Polling sources...');
        const res = await searchGrounding(input);
        setResult(res);
      } else if (activeTab === 'voice') {
        setLoadingMsg('TTS: Cloning voice profile...');
        const base64 = await generateSpeech(input);
        if (base64) {
          const pcm = decodeBase64(base64);
          const header = createWavHeader(pcm.length, 24000);
          const url = URL.createObjectURL(new Blob([header, pcm], { type: 'audio/wav' }));
          setAudioUrl(url);
          setResult('Generated');
        }
      }
    } catch (e) {
      setResult("Engine failure. Please refine prompt parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[32px] overflow-hidden luxury-shadow">
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'chat', icon: '💬', label: 'Pro' },
          { id: 'image', icon: '🎨', label: 'Pro Image' },
          { id: 'video', icon: '🎬', label: 'Veo' },
          { id: 'edit', icon: '🪄', label: 'Edit' },
          { id: 'search', icon: '🌐', label: 'Search' },
          { id: 'voice', icon: '🎙️', label: 'Speech' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setResult(null); setInput(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-5 px-6 text-[10px] font-black uppercase tracking-widest transition-all min-w-[120px] ${
              activeTab === tab.id ? 'bg-white text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-10 space-y-8 bg-white">
        {(activeTab === 'video' || activeTab === 'edit') && (
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Asset</p>
            <div className="flex items-center gap-6">
              <input type="file" onChange={handleImageUpload} className="hidden" id="asset-up" />
              <label htmlFor="asset-up" className="cursor-pointer px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                {uploadedImage ? 'Replace Image' : 'Select Source'}
              </label>
              {uploadedImage && <img src={uploadedImage} className="w-16 h-16 object-cover rounded-xl border border-slate-100 luxury-shadow" />}
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Resolution</p>
              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map(s => (
                  <button key={s} onClick={() => setImageSize(s)} className={`px-5 py-2 rounded-lg text-[10px] font-bold border transition-all ${imageSize === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aspect Ratio</p>
              <div className="flex gap-2">
                {(['1:1', '16:9', '9:16'] as const).map(r => (
                  <button key={r} onClick={() => setAspectRatio(r as any)} className={`px-5 py-2 rounded-lg text-[10px] font-bold border transition-all ${aspectRatio === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>{r}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex items-center gap-3">
            <input type="checkbox" id="think" checked={useThinking} onChange={(e) => setUseThinking(e.target.checked)} className="w-4 h-4 accent-slate-900 rounded cursor-pointer" />
            <label htmlFor="think" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900 transition-all">Enable CoT Reasoning (Thinking Mode)</label>
          </div>
        )}

        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter system instructions or ${activeTab} description...`}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 outline-none focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 min-h-[160px] resize-none transition-all placeholder:text-slate-300 font-medium"
          />
          <button
            onClick={executeAction}
            disabled={loading || (!input && activeTab !== 'live')}
            className="absolute bottom-6 right-6 px-10 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
          >
            {loading ? 'Processing...' : 'Run Prototype'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-4 space-y-4">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">{loadingMsg}</p>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in zoom-in duration-500 pt-8 border-t border-slate-100">
            {activeTab === 'chat' || activeTab === 'search' ? (
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">
                {typeof result === 'string' ? result : result.text}
                {result.sources && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Verified Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((s: any, i: number) => (
                        <a key={i} href={s.uri} target="_blank" className="text-[9px] font-bold px-3 py-1 bg-white border border-slate-200 rounded-md hover:bg-slate-900 hover:text-white transition-all">{s.title || 'Source'}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (activeTab === 'image' || activeTab === 'edit') ? (
              <div className="luxury-shadow rounded-2xl overflow-hidden border border-slate-100">
                <img src={result} className="w-full h-auto" />
              </div>
            ) : activeTab === 'video' ? (
              <div className="luxury-shadow rounded-2xl overflow-hidden border border-slate-100 bg-black">
                <video src={result} controls autoPlay className="w-full h-auto aspect-video" />
              </div>
            ) : activeTab === 'voice' ? (
              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <span className="text-xl">🎙️</span>
                <audio src={audioUrl!} controls className="flex-1 h-10" />
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 px-10 py-5 flex justify-between items-center border-t border-slate-200">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Environment: Inventional Lab v3.0</span>
        <div className="flex gap-2 items-center">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-900">Stable Node Connected</span>
        </div>
      </div>
    </div>
  );
};
