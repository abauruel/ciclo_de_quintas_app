import React, { useState, useMemo } from 'react';
import { ChordWheel } from './components/ChordWheel';
import { getChordsForKey } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Music, RotateCcw, Info, ChevronRight, ChevronLeft, Languages } from 'lucide-react';
import { translations, Language } from './translations';

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [lang, setLang] = useState<Language>('pt');

  const t = translations[lang];

  const keyData = useMemo(() => getChordsForKey(selectedIndex), [selectedIndex]);

  const handlePrev = () => setSelectedIndex((prev) => (prev - 1 + 12) % 12);
  const handleNext = () => setSelectedIndex((prev) => (prev + 1) % 12);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-6 py-8 gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-xs text-white/40 font-mono uppercase tracking-widest">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-full p-1">
            {(['en', 'pt', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[10px] font-bold rounded-full transition-colors ${
                  lang === l ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <Info className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      {/* Main Wheel Section */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-full relative">
          <ChordWheel 
            selectedIndex={selectedIndex} 
            onSelectKey={setSelectedIndex} 
          />
          
          {/* Quick Nav Controls */}
          <div className="absolute inset-y-0 -left-4 flex items-center z-40">
            <button onClick={handlePrev} className="p-2 text-blue-400/80 hover:text-blue-300 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>
          <div className="absolute inset-y-0 -right-4 flex items-center z-40">
            <button onClick={handleNext} className="p-2 text-blue-400/80 hover:text-blue-300 transition-colors drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Selected Key Display */}
        <div className="w-full glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">{t.activeKey}</span>
              <h2 className="text-3xl font-black">{keyData.root} {t.major}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{t.relativeMinor}</span>
              <p className="text-lg font-bold text-white/80">{keyData.minor[2]}m</p>
            </div>
          </div>

          <div className="h-[1px] bg-white/10 w-full" />

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/30 uppercase">{t.primaryChords}</span>
              <div className="flex gap-2">
                {keyData.major.map(c => (
                  <span key={c} className="px-2 py-1 rounded bg-white/5 text-sm font-bold">{c}</span>
                ))}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-mono text-white/30 uppercase">{t.secondaryChords}</span>
              <div className="flex gap-2 justify-end">
                {keyData.minor.slice(0, 2).map(c => (
                  <span key={c} className="px-2 py-1 rounded bg-blue-500/10 text-blue-200 text-sm font-bold">{c}m</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-2">
        <p className="text-[10px] text-white/30 uppercase tracking-wider">{t.footerHint}</p>
        <button 
          onClick={() => setSelectedIndex(0)}
          className="flex items-center gap-2 text-[10px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          {t.reset}
        </button>
      </footer>

      {/* Info Modal Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-8 max-w-sm space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold">{t.infoTitle}</h3>
              <div className="space-y-4 text-white/70 text-sm leading-relaxed">
                <p>
                  {t.infoIntro}
                </p>
                <p>
                  <strong className="text-white">{t.infoWindow}</strong> 
                  <br/>• <span className="text-white">{t.infoBottom}</span>
                  <br/>• <span className="text-white">{t.infoMiddle}</span>
                  <br/>• <span className="text-white">{t.infoTop}</span>
                </p>
                <p>
                  <strong className="text-white">{t.infoTransposing}</strong>
                </p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-colors"
              >
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

