
import React, { useState, useCallback } from 'react';
import { GeneratorSettings, AIInsight } from './types';
import { getNumberInsights } from './services/geminiService';

// Icons as components
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const WandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8 19 13"></path><path d="M15 9h0"></path><path d="M17.8 6.2 19 5"></path><path d="m3 21 9-9"></path><path d="M12.2 6.2 11 5"></path></svg>
);

const App: React.FC = () => {
  const [settings, setSettings] = useState<GeneratorSettings>({
    min: 1,
    max: 60,
    count: 6,
    unique: true,
    sorted: true,
  });

  const [results, setResults] = useState<number[]>([]);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNumbers = useCallback(() => {
    setError(null);
    const { min, max, count, unique } = settings;

    if (min >= max) {
      setError("O valor mínimo deve ser menor que o máximo.");
      return;
    }

    if (unique && count > (max - min + 1)) {
      setError("Intervalo insuficiente para números únicos.");
      return;
    }

    const newResults: number[] = [];
    const used = new Set<number>();

    while (newResults.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (unique) {
        if (!used.has(num)) {
          used.add(num);
          newResults.push(num);
        }
      } else {
        newResults.push(num);
      }
    }

    if (settings.sorted) {
      newResults.sort((a, b) => a - b);
    }

    setResults(newResults);
    setInsight(null);
  }, [settings]);

  const handleAIInsight = async () => {
    if (results.length === 0) return;
    setLoadingAI(true);
    const res = await getNumberInsights(results);
    setInsight(res);
    setLoadingAI(false);
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(", "));
  };

  const clear = () => {
    setResults([]);
    setInsight(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-6xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-4 tracking-tighter italic">
          MEGA DA VIRADA
        </h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase font-light">The Master Predictor Engine</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <section className="lg:col-span-4 glass rounded-[2rem] p-8 flex flex-col gap-6 shadow-2xl">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-500 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Setup do Jogo
          </h2>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-600">Intervalo</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={settings.min}
                  onChange={(e) => setSettings({ ...settings, min: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={settings.max}
                  onChange={(e) => setSettings({ ...settings, max: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-600">Qtd de Dezenas</label>
              <input
                type="number"
                value={settings.count}
                onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) || 1 })}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 text-sm transition-all"
              />
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${settings.unique ? 'bg-emerald-500 border-emerald-500' : 'bg-black/40 border-white/10 group-hover:border-emerald-500/50'}`}>
                  {settings.unique && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={settings.unique}
                  onChange={(e) => setSettings({ ...settings, unique: e.target.checked })}
                />
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">Sem repetições</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${settings.sorted ? 'bg-emerald-500 border-emerald-500' : 'bg-black/40 border-white/10 group-hover:border-emerald-500/50'}`}>
                  {settings.sorted && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={settings.sorted}
                  onChange={(e) => setSettings({ ...settings, sorted: e.target.checked })}
                />
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">Ordem crescente</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-500/80 text-[10px] font-bold rounded-lg uppercase tracking-tight">
              {error}
            </div>
          )}

          <button
            onClick={generateNumbers}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-4 rounded-2xl glow-button transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 text-xs uppercase tracking-widest"
          >
            Sortear Números
          </button>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-8 space-y-6">
          <div className="glass rounded-[2rem] p-10 min-h-[450px] flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">
                Seu Palpite
              </h2>
              <div className="flex gap-1.5">
                <button 
                  onClick={copyToClipboard}
                  disabled={results.length === 0}
                  className="p-2.5 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 disabled:opacity-20 transition-all"
                >
                  <CopyIcon />
                </button>
                <button 
                  onClick={clear}
                  disabled={results.length === 0}
                  className="p-2.5 rounded-xl bg-white/2 hover:bg-red-500/10 hover:text-red-500 border border-white/5 disabled:opacity-20 transition-all"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              {results.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6 animate-in fade-in zoom-in duration-700">
                  {results.map((num, idx) => (
                    <div 
                      key={`${num}-${idx}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-2 border-emerald-500/30 text-3xl font-black text-white bg-gradient-to-b from-emerald-500/5 to-transparent shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:border-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all cursor-default relative overflow-hidden group"
                    >
                       <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-all" />
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-6 opacity-30">
                  <div className="text-7xl font-thin tracking-tighter">00</div>
                  <p className="text-[10px] uppercase tracking-[0.3em]">Aguardando Sorteio</p>
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAIInsight}
                  disabled={loadingAI}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/2 border border-white/5 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all disabled:opacity-50 text-[10px] uppercase font-black tracking-widest"
                >
                  {loadingAI ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-emerald-500 border-t-transparent"></div>
                  ) : (
                    <WandIcon />
                  )}
                  {loadingAI ? "Consultando Gemini" : "Analise do Destino"}
                </button>
              </div>
            )}
          </div>

          {/* AI Insight Card */}
          {insight && (
            <div className="glass rounded-[2rem] p-8 border-emerald-500/10 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-6 text-emerald-500">
                <WandIcon />
                <span className="text-[10px] uppercase font-black tracking-widest">Relatório Gemini IA</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-tighter">Leitura Estatística</h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{insight.analysis}</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-tighter">Vibe do Jogo</h4>
                    <p className="text-xs text-emerald-400 italic">"{insight.patternObserved}"</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-tighter">Matemática Curiosa</h4>
                    <p className="text-[11px] text-gray-400 leading-tight">{insight.funFact}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-20 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/2 border border-white/5">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600 font-bold italic">Algorithm v4.0.2 / Dark Edition</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
