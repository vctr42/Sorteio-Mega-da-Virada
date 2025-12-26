
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
      setError("Mínimo deve ser menor que o Máximo.");
      return;
    }

    if (unique && count > (max - min + 1)) {
      setError("Intervalo insuficiente.");
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
    try {
      const res = await getNumberInsights(results);
      setInsight(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const copyToClipboard = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(", "));
    // Feedback visual silencioso ou toast poderia entrar aqui
  };

  const clear = () => {
    setResults([]);
    setInsight(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-1000">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-b from-white to-gray-700 bg-clip-text text-transparent mb-4 tracking-tighter italic uppercase">
          Mega da Virada
        </h1>
        <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase font-bold">The Destiny Algorithm</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel */}
        <section className="lg:col-span-4 glass rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl">
          <h2 className="text-[11px] uppercase tracking-[0.3em] font-black text-emerald-500 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>
            Setup
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-600 ml-1">Range de Números</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={settings.min}
                  onChange={(e) => setSettings({ ...settings, min: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500/30 text-sm transition-all text-white placeholder-gray-700"
                  placeholder="De"
                />
                <input
                  type="number"
                  value={settings.max}
                  onChange={(e) => setSettings({ ...settings, max: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500/30 text-sm transition-all text-white placeholder-gray-700"
                  placeholder="Até"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-600 ml-1">Quantidade</label>
              <input
                type="number"
                value={settings.count}
                onChange={(e) => setSettings({ ...settings, count: parseInt(e.target.value) || 1 })}
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500/30 text-sm transition-all text-white"
              />
            </div>

            <div className="pt-2 flex flex-col gap-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={() => setSettings(s => ({...s, unique: !s.unique}))}
                  className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center ${settings.unique ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-black/50 border-white/10 group-hover:border-emerald-500/30'}`}
                >
                  {settings.unique && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-tight">Sem números repetidos</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={() => setSettings(s => ({...s, sorted: !s.sorted}))}
                  className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center ${settings.sorted ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-black/50 border-white/10 group-hover:border-emerald-500/30'}`}
                >
                  {settings.sorted && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors uppercase tracking-tight">Ordem Crescente</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-500/80 text-[10px] font-black rounded-xl uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <button
            onClick={generateNumbers}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-5 rounded-[1.5rem] glow-button transition-all flex items-center justify-center gap-3 mt-4 text-xs uppercase tracking-[0.2em]"
          >
            Sincronizar Destino
          </button>
        </section>

        {/* Results Panel */}
        <section className="lg:col-span-8 space-y-8">
          <div className="glass rounded-[2.5rem] p-10 min-h-[480px] flex flex-col shadow-2xl relative">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-black text-gray-500">
                Números Sincronizados
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  disabled={results.length === 0}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 disabled:opacity-10 transition-all text-gray-400"
                >
                  <CopyIcon />
                </button>
                <button 
                  onClick={clear}
                  disabled={results.length === 0}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-red-500/10 hover:text-red-500 border border-white/5 disabled:opacity-10 transition-all text-gray-400"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center py-10">
              {results.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-6 md:gap-8 animate-in fade-in zoom-in duration-700">
                  {results.map((num, idx) => (
                    <div 
                      key={`${num}-${idx}`}
                      className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full border-2 border-emerald-500/20 text-3xl md:text-5xl font-black text-white bg-gradient-to-b from-emerald-500/[0.08] to-transparent shadow-[0_0_40px_rgba(16,185,129,0.03)] hover:border-emerald-500/80 hover:scale-110 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all cursor-default"
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-8 opacity-20">
                  <div className="text-8xl md:text-9xl font-thin tracking-tighter text-gray-400 italic">...</div>
                  <p className="text-[10px] uppercase tracking-[0.5em] font-bold">Waiting for input</p>
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleAIInsight}
                  disabled={loadingAI}
                  className="flex items-center gap-4 px-10 py-4 rounded-full bg-white/[0.02] border border-white/5 text-gray-500 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all disabled:opacity-50 text-[10px] uppercase font-black tracking-[0.2em]"
                >
                  {loadingAI ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-emerald-500 border-t-transparent"></div>
                  ) : (
                    <WandIcon />
                  )}
                  {loadingAI ? "Lendo Variáveis..." : "Análise do Oráculo"}
                </button>
              </div>
            )}
          </div>

          {/* AI Insight Card */}
          {insight && (
            <div className="glass rounded-[2.5rem] p-10 border-emerald-500/5 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-8 text-emerald-500/80">
                <WandIcon />
                <span className="text-[11px] uppercase font-black tracking-[0.3em]">IA Predictor Report</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Leitura de Probabilidade</h4>
                  <p className="text-base text-gray-300 leading-relaxed font-light">{insight.analysis}</p>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Aura Observada</h4>
                    <p className="text-xs text-emerald-500 font-bold italic tracking-tight">"{insight.patternObserved}"</p>
                  </div>
                  <div className="space-y-2 border-t border-white/5 pt-6">
                    <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Fato Numérico</h4>
                    <p className="text-[12px] text-gray-400 leading-relaxed font-light">{insight.funFact}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-24 text-center">
        <div className="inline-block px-8 py-2 rounded-full bg-white/[0.02] border border-white/5">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-700 font-black italic">End of Line / 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
