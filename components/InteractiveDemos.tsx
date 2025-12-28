
import React, { useState, useRef } from 'react';
import { generateAIText, generateImage, searchGrounding, generateSpeech } from '../services/gemini';
import { db } from '../services/storage';

// Helper to decode base64 to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM audio data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const DemoCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col gap-4 h-full">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    <div className="flex-1 flex flex-col gap-4">
      {children}
    </div>
  </div>
);

export const InteractiveDemos: React.FC = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatResult, setChatResult] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [speechText, setSpeechText] = useState('');
  const [isSpeechLoading, setIsSpeechLoading] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleChat = async () => {
    if (!chatInput) return;
    setIsChatLoading(true);
    try {
      const res = await generateAIText(chatInput);
      setChatResult(res || '');
      db.saveRecord({ type: 'chat', input: chatInput, output: res || '' });
    } catch (e) {
      setChatResult("Error generating response. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleImage = async () => {
    if (!imagePrompt) return;
    setIsImageLoading(true);
    try {
      const res = await generateImage(imagePrompt);
      setImageUrl(res);
      if (res) db.saveRecord({ type: 'image', input: imagePrompt, output: '[Image Data Generated]' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearchLoading(true);
    try {
      const res = await searchGrounding(searchQuery);
      setSearchResult(res);
      db.saveRecord({ type: 'search', input: searchQuery, output: res.text });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSpeech = async () => {
    if (!speechText) return;
    setIsSpeechLoading(true);
    setAudioReady(false);
    try {
      const base64Audio = await generateSpeech(speechText);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
        setAudioReady(true);
        db.saveRecord({ type: 'voice', input: speechText, output: '[Audio PCM Generated]' });
      }
    } catch (e) {
      console.error("Speech generation error:", e);
    } finally {
      setIsSpeechLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Experience the Power of Your White-Label Suite</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          These tools come pre-built in your dashboard. Customize them with your logo and sell them to clients instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Chatbot Demo */}
        <DemoCard title="Smart AI Chatbot" icon="💬">
          <p className="text-sm text-slate-400">Ask anything. This is what your clients get.</p>
          <div className="space-y-3">
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Write a 30-day marketing plan for a gym."
              rows={3}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button 
              onClick={handleChat}
              disabled={isChatLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50"
            >
              {isChatLoading ? "Thinking..." : "Generate Demo Response"}
            </button>
            {chatResult && (
              <div className="bg-slate-900 p-3 rounded-lg text-xs text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {chatResult}
              </div>
            )}
          </div>
        </DemoCard>

        {/* Image Generation Demo */}
        <DemoCard title="AI Image Studio" icon="🎨">
          <p className="text-sm text-slate-400">Let clients generate marketing assets in seconds.</p>
          <div className="space-y-3">
            <input 
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., A luxury villa in Goa at sunset"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
            <button 
              onClick={handleImage}
              disabled={isImageLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50"
            >
              {isImageLoading ? "Generating..." : "Generate Image"}
            </button>
            {imageUrl && (
              <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-700">
                <img src={imageUrl} alt="AI Generated" className="object-cover w-full h-full" />
              </div>
            )}
          </div>
        </DemoCard>

        {/* Real-time Search Grounding */}
        <DemoCard title="Global AI Search" icon="🌐">
          <p className="text-sm text-slate-400">Up-to-the-minute info with Google Search Grounding.</p>
          <div className="space-y-3">
            <input 
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Current USD to INR rate"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={handleSearch}
              disabled={isSearchLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50"
            >
              {isSearchLoading ? "Searching..." : "Get Live Data"}
            </button>
            {searchResult && (
              <div className="bg-slate-900 p-3 rounded-lg text-xs text-slate-300 space-y-2">
                <p>{searchResult.text}</p>
                {searchResult.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-700">
                    <p className="font-bold text-[10px] uppercase text-slate-500 mb-1">Sources:</p>
                    {searchResult.sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="block text-indigo-400 hover:underline truncate">
                        {s.title || s.uri}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DemoCard>

        {/* Voice AI Demo */}
        <DemoCard title="Voice AI (TTS)" icon="🎙️">
          <p className="text-sm text-slate-400">Convert marketing copy into human-like audio.</p>
          <div className="space-y-3">
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Welcome to our premium resort. We hope you enjoy your stay!"
              rows={3}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
            />
            <button 
              onClick={handleSpeech}
              disabled={isSpeechLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSpeechLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : "Speak Text"}
            </button>
            {audioReady && (
              <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-indigo-500/30">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                <span className="text-xs text-slate-300">Playing generated audio...</span>
              </div>
            )}
            <p className="text-[10px] text-slate-500 text-center">Uses high-fidelity PCM streaming</p>
          </div>
        </DemoCard>
      </div>
    </section>
  );
};
