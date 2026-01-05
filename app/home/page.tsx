"use client";

import { useState, ChangeEvent } from "react";
import * as Tesseract from "tesseract.js";

type Analysis = {
  verdict?: string;
  quick_reason?: string;
  why_it_matters?: string[];
  who_should_be_careful?: {
    kids?: string;
    diabetics?: string;
    fitness?: string;
    elderly?: string;
  };
  risk_meter?: string;
  better_swaps?: string[];
  honesty_note?: string;
};

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [data, setData] = useState<Analysis | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingOCR(true);
    setIngredients("Scanning image... please wait...");

    try {
      const result = await Tesseract.recognize(file, "eng");
      const cleanText = result.data.text.replace(/\s+/g, " ").trim();
      setIngredients(cleanText.length > 3 ? cleanText : "");
    } catch {
      alert("❌ OCR failed — try again");
      setIngredients("");
    }
    setLoadingOCR(false);
  };

  const analyzeIngredients = async () => {
    if (!ingredients.trim()) return alert("⚠️ Add ingredients first!");

    setLoadingAI(true);
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      const result = (await res.json()) as Partial<Analysis>;
      setData(result);
    } catch (err) {
      alert("❌ Could not analyze. Check console.");
      console.error(err);
    }

    setLoadingAI(false);
  };

  const isBusy = loadingOCR || loadingAI;

  const verdictColor = (v?: string) => {
    if (!v) return "bg-cyan-950/90 border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.5)]";
    const x = v.toLowerCase();
    if (x.includes("safe"))
      return "bg-emerald-950/90 border-emerald-400 shadow-[0_0_100px_rgba(52,211,153,0.7)] text-emerald-200";
    if (x.includes("ok") || x.includes("sometimes"))
      return "bg-amber-950/90 border-amber-400 shadow-[0_0_100px_rgba(251,191,36,0.7)] text-amber-200";
    if (x.includes("avoid"))
      return "bg-rose-950/90 border-rose-400 shadow-[0_0_100px_rgba(251,113,133,0.7)] text-rose-200";
    return "bg-cyan-950/90 border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.5)]";
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black font-sans relative overflow-hidden selection:bg-cyan-400/50">
      
      {/* ENHANCED NEON BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/30 rounded-full blur-[180px] animate-pulse-neon" />
        <div className="absolute inset-0 animate-sweep-left">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/20 via-transparent to-teal-500/20 blur-xl" />
        </div>
        <div className="absolute inset-0 animate-sweep-right delay-1000">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-teal-500/20 via-transparent to-cyan-500/20 blur-xl" />
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 animate-flicker mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-move" />
      </div>

      {/* ABOUT US BUTTON - Top Right Corner */}
      <button
        onClick={() => setShowAbout(true)}
        className="fixed top-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-cyan-600/30 to-teal-600/30 hover:from-cyan-500/50 hover:to-teal-500/50 backdrop-blur-xl border-2 border-cyan-400/60 rounded-full font-bold text-cyan-200 uppercase tracking-wider transition-all duration-300 shadow-neon-btn hover:shadow-neon-btn-hover"
      >
        About Us
      </button>

      {/* ABOUT US MODAL */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl bg-gradient-to-br from-cyan-950/95 via-black/95 to-teal-950/95 border-4 border-cyan-400/60 rounded-3xl shadow-neon-panel overflow-hidden animate-scale-in">
            
            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-rose-600/30 hover:bg-rose-500/50 border-2 border-rose-400/60 rounded-full text-2xl text-white transition-all duration-300 shadow-neon-btn hover:shadow-neon-btn-hover z-10"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="p-12 space-y-8 max-h-[80vh] overflow-y-auto">
              
              {/* Header */}
              <div className="text-center space-y-4 border-b-2 border-cyan-400/30 pb-8">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-cyan-600/40 to-teal-600/40 rounded-full backdrop-blur-xl border-4 border-cyan-400/70 shadow-neon animate-glow-pulse">
                  <span className="text-5xl drop-shadow-neon">🤖</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-white tracking-tight drop-shadow-neon">
                  About Our Mission
                </h2>
                <p className="text-xl text-cyan-200/80 font-medium tracking-wide">
                  Empowering Health Decisions Through AI
                </p>
              </div>

              {/* Mission Statement */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border-2 border-cyan-400/40 rounded-2xl p-8 backdrop-blur-xl shadow-neon-card">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl drop-shadow-neon">🎯</span>
                  <h3 className="text-2xl font-black text-cyan-200 uppercase tracking-wider">Our Mission</h3>
                </div>
                <p className="text-lg text-slate-200 leading-relaxed">
                  We believe everyone deserves to understand what they consume. Our AI Health Co-Pilot System uses cutting-edge artificial intelligence to decode complex ingredient labels and provide clear, actionable health insights in seconds. We are making nutritional transparency accessible to all.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border-2 border-emerald-400/40 rounded-2xl p-6 backdrop-blur-xl shadow-neon-card hover:border-emerald-400/60 transition-all">
                  <div className="text-3xl mb-3 drop-shadow-neon">⚡</div>
                  <h4 className="text-xl font-bold text-emerald-200 mb-2">Instant Analysis</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Get comprehensive health assessments in seconds using advanced AI technology.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border-2 border-teal-400/40 rounded-2xl p-6 backdrop-blur-xl shadow-neon-card hover:border-teal-400/60 transition-all">
                  <div className="text-3xl mb-3 drop-shadow-neon">📸</div>
                  <h4 className="text-xl font-bold text-teal-200 mb-2">Smart OCR</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Simply scan product labels with your camera for automatic ingredient extraction.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-2 border-cyan-400/40 rounded-2xl p-6 backdrop-blur-xl shadow-neon-card hover:border-cyan-400/60 transition-all">
                  <div className="text-3xl mb-3 drop-shadow-neon">🎯</div>
                  <h4 className="text-xl font-bold text-cyan-200 mb-2">Personalized Insights</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Tailored health recommendations based on specific dietary needs and conditions.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-2 border-purple-400/40 rounded-2xl p-6 backdrop-blur-xl shadow-neon-card hover:border-purple-400/60 transition-all">
                  <div className="text-3xl mb-3 drop-shadow-neon">🔬</div>
                  <h4 className="text-xl font-bold text-purple-200 mb-2">Science-Backed</h4>
                  <p className="text-slate-300 leading-relaxed">
                    All assessments grounded in current nutritional science and research.
                  </p>
                </div>
              </div>

              {/* Team/Technology Section */}
              <div className="bg-gradient-to-br from-rose-900/30 to-orange-900/30 border-2 border-rose-400/40 rounded-2xl p-8 backdrop-blur-xl shadow-neon-card">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl drop-shadow-neon">🚀</span>
                  <h3 className="text-2xl font-black text-rose-200 uppercase tracking-wider">Powered by Innovation</h3>
                </div>
                <p className="text-lg text-slate-200 leading-relaxed mb-4">
                  Built with state-of-the-art AI models, real-time OCR processing, and a sleek cyberpunk-inspired interface. We combine powerful machine learning with intuitive design to deliver health insights that are both sophisticated and simple to understand.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-400/40 rounded-lg text-cyan-200 text-sm font-bold">AI/ML</span>
                  <span className="px-4 py-2 bg-teal-600/20 border border-teal-400/40 rounded-lg text-teal-200 text-sm font-bold">Computer Vision</span>
                  <span className="px-4 py-2 bg-emerald-600/20 border border-emerald-400/40 rounded-lg text-emerald-200 text-sm font-bold">OCR Technology</span>
                  <span className="px-4 py-2 bg-purple-600/20 border border-purple-400/40 rounded-lg text-purple-200 text-sm font-bold">Health Analytics</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center pt-6">
                <p className="text-cyan-300 font-bold tracking-[0.3em] uppercase text-sm opacity-70">
                  Your Health, Decoded by AI
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-10 py-8">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-cyan-600/30 to-teal-600/30 rounded-full backdrop-blur-xl border-4 border-cyan-400/60 shadow-neon animate-glow-pulse">
            <span className="text-6xl drop-shadow-neon animate-heart-pulse">❤️</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-teal-300 to-white tracking-tight drop-shadow-neon">
            AI HEALTH
            <span className="block text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mt-2 tracking-[0.4em] uppercase animate-title-glow">
              CO-PILOT SYSTEM
            </span>
          </h1>
        </div>

        {/* NEON CONTROL PANEL */}
        <div className="bg-gradient-to-br from-[#001111]/90 via-black/95 to-[#000a0a]/90 backdrop-blur-2xl rounded-3xl shadow-neon-panel border-4 border-cyan-400/50 relative overflow-hidden group/panel">
          
          <div className="absolute inset-0 rounded-3xl opacity-70 animate-border-sweep">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-2xl" />
          </div>
          
          <div className="p-8 space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-cyan-500/30 pb-6">
              <div>
                 <h2 className="text-sm font-black text-cyan-300 uppercase tracking-[0.3em] mb-2 animate-text-flicker">Input Source</h2>
                 <p className="text-slate-100 font-bold text-xl">Upload product label or ingredients</p>
              </div>
              
              <div className="flex gap-4">
                <label className="cursor-pointer flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-cyan-600/20 to-teal-700/10 hover:from-cyan-500/30 hover:to-teal-600/20 border-4 border-cyan-400/50 rounded-2xl transition-all duration-500 shadow-neon-btn hover:shadow-neon-btn-hover group/btn backdrop-blur-xl">
                  <input type="file" accept="image/*" capture="environment" hidden onChange={handleImageUpload} />
                  <span className="text-3xl group-hover/btn:scale-110 transition-transform drop-shadow-neon">📷</span>
                  <span className="text-base font-bold text-cyan-200 uppercase tracking-wider group-hover/btn:text-cyan-100">SCAN</span>
                </label>
                
                <label className="cursor-pointer flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-teal-600/20 to-cyan-700/10 hover:from-teal-500/30 hover:to-cyan-600/20 border-4 border-teal-400/50 rounded-2xl transition-all duration-500 shadow-neon-btn hover:shadow-neon-btn-hover group/btn backdrop-blur-xl">
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  <span className="text-3xl group-hover/btn:scale-110 transition-transform drop-shadow-neon">🖼️</span>
                  <span className="text-base font-bold text-teal-200 uppercase tracking-wider group-hover/btn:text-teal-100">UPLOAD</span>
                </label>
              </div>
            </div>

            <div className="relative rounded-2xl p-1 bg-gradient-to-br from-cyan-900/20 via-black/90 to-teal-900/20 shadow-inner border-4 border-cyan-400/40">
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={loadingOCR ? "INITIALIZING OPTICAL RECOGNITION..." : "Paste raw ingredient data here..."}
                className="w-full h-48 bg-black/70 backdrop-blur-xl rounded-xl p-6 text-cyan-100 placeholder-teal-600 resize-none outline-none text-lg font-mono leading-relaxed focus:text-white transition-all shadow-inner"
              />
              <div className="absolute bottom-4 right-5 flex gap-3">
                 <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-neon-dot" />
                 <div className="w-3 h-3 rounded-full bg-teal-500 shadow-neon-dot" />
                 <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-neon-dot" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <button
                onClick={() => setIngredients("Milk solids, whey protein concentrate, sucralose, acesulfame K, E450")}
                className="flex items-center gap-3 text-sm font-bold text-teal-300 hover:text-cyan-200 transition-all uppercase tracking-wide group"
              >
                <span className="p-3 rounded-xl bg-gradient-to-br from-cyan-600/20 to-teal-600/20 group-hover:from-cyan-500/40 group-hover:to-teal-500/40 transition-all shadow-neon-btn text-xl">✨</span> 
                Load Simulation Data
              </button>

              <button
                onClick={analyzeIngredients}
                disabled={isBusy}
                className={`
                  relative overflow-hidden w-full md:w-auto px-10 py-5 rounded-xl font-black text-white text-xl tracking-widest uppercase shadow-neon-analyze
                  transition-all duration-500 transform active:scale-95 border-4 border-cyan-400/60 group
                  ${isBusy ? "bg-gradient-to-r from-slate-800 to-black cursor-not-allowed" : "bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-500 hover:via-teal-500 hover:to-cyan-600 hover:shadow-neon-analyze-hover"}
                `}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="relative z-10 flex items-center justify-center gap-4">
                   {isBusy ? (
                     <>
                       <span className="animate-spin text-3xl">⚙️</span> PROCESSING
                     </>
                   ) : (
                     <>
                       ANALYZE <span className="text-3xl animate-pulse">🚀</span>
                     </>
                   )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* NEON RESULTS HUD */}
        {data && (
            <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-800">

                <div className={`p-10 rounded-3xl text-center relative overflow-hidden border-4 ${verdictColor(data?.verdict)} backdrop-blur-xl animate-verdict-glow`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
                    <div className="relative z-10">
                        <h2 className="text-sm font-black text-white/80 uppercase tracking-[0.5em] mb-4">SYSTEM VERDICT</h2>
                        <div className="text-5xl md:text-6xl font-black text-white drop-shadow-neon tracking-tight">
                            {data?.verdict ?? "UNKNOWN"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-black/80 via-cyan-950/30 to-black/80 backdrop-blur-2xl border-4 border-cyan-400/50 p-8 rounded-3xl shadow-neon-card relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-cyan-600/10 blur-3xl group-hover:opacity-60 transition-opacity" />
                         <h3 className="text-xl font-bold text-cyan-200 uppercase tracking-wider mb-6 flex items-center gap-3">
                            <span className="w-3 h-3 bg-cyan-300 rounded-full animate-ping" /> Core Analysis
                         </h3>
                         <p className="text-2xl font-medium text-slate-100 leading-relaxed">
                            {data?.quick_reason ?? "No data available."}
                         </p>
                    </div>

                    <div className="bg-gradient-to-b from-rose-950/80 to-black/80 backdrop-blur-2xl border-4 border-rose-400/60 p-8 rounded-3xl shadow-neon-card flex flex-col items-center justify-center text-center relative overflow-hidden">
                         <h3 className="text-xl font-bold text-rose-200 uppercase tracking-wider mb-6">Risk Level</h3>
                         <div className="text-8xl animate-pulse drop-shadow-neon">
                            {data?.risk_meter ?? "⚪"}
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-cyan-950/50 to-black/90 backdrop-blur-2xl border-4 border-cyan-400/50 p-8 rounded-3xl shadow-neon-card">
                        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-2xl shadow-neon-icon">📌</span> 
                            Key Impacts
                        </h3>
                        <ul className="space-y-4">
                            {Array.isArray(data?.why_it_matters)
                            ? data.why_it_matters.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-slate-200 font-medium text-lg">
                                    <span className="mt-2 w-3 h-3 rounded-full bg-cyan-400 shadow-neon-dot animate-pulse" />
                                    {item}
                                </li>
                            ))
                            : <li className="text-slate-400">No data.</li>}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-teal-950/50 to-black/90 backdrop-blur-2xl border-4 border-teal-400/50 p-8 rounded-3xl shadow-neon-card">
                         <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-2xl shadow-neon-icon">👤</span> 
                            Advisory
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                              { label: "Kids", val: data?.who_should_be_careful?.kids },
                              { label: "Diabetics", val: data?.who_should_be_careful?.diabetics },
                              { label: "Fitness", val: data?.who_should_be_careful?.fitness },
                              { label: "Elderly", val: data?.who_should_be_careful?.elderly }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 p-6 rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-300 transition-all shadow-neon-card">
                                    <div className="text-sm font-bold text-slate-400 uppercase mb-2">{item.label}</div>
                                    <div className="text-xl font-bold text-white">{item.val ?? "N/A"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-950/60 via-teal-950/60 to-cyan-950/60 border-4 border-emerald-400/50 p-10 rounded-3xl shadow-neon-card backdrop-blur-xl">
                    <h3 className="text-2xl font-black text-emerald-300 mb-6 flex items-center gap-4">
                        <span className="text-4xl animate-bounce">🥗</span> Better Alternatives
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        {Array.isArray(data?.better_swaps)
                        ? data.better_swaps.map((swap, i) => (
                            <span key={i} className="px-6 py-4 bg-emerald-600/20 border-2 border-emerald-400/50 rounded-xl text-emerald-200 font-bold text-lg uppercase tracking-wide shadow-neon-btn hover:shadow-neon-btn-hover transition-all hover:scale-105">
                                {swap}
                            </span>
                        ))
                        : <span className="text-slate-400 text-lg">No alternatives found.</span>}
                    </div>
                </div>

                <p className="text-center text-cyan-300 text-sm uppercase tracking-[0.4em] font-bold opacity-70">
                    Analysis Note: {data?.honesty_note ?? "Standard Protocol"}
                </p>
            </div>
        )}

        <footer className="mt-12 border-t-2 border-cyan-400/40 pt-8 text-center">
            <p className="text-cyan-300 text-sm font-bold tracking-[0.5em] opacity-60">SECURE AI HEALTH SYSTEM © 2026</p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes pulse-neon {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes sweep-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sweep-right {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes title-glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.4); }
          50% { box-shadow: 0 0 40px rgba(6,182,212,0.8); }
        }
        @keyframes border-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes verdict-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-pulse-neon { animation: pulse-neon 6s ease-in-out infinite; }
        .animate-sweep-left { animation: sweep-left 12s linear infinite; }
        .animate-sweep-right { animation: sweep-right 12s linear infinite; }
        .animate-grid-move { animation: grid-move 20s linear infinite; }
        .animate-flicker { animation: flicker 6s ease-in-out infinite; }
        .animate-heart-pulse { animation: heart-pulse 2s ease-in-out infinite; }
        .animate-title-glow { animation: title-glow 4s ease-in-out infinite; }
        .animate-text-flicker { animation: text-flicker 3s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
        .animate-border-sweep { animation: border-sweep 5s linear infinite; }
        .animate-verdict-glow { animation: verdict-glow 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }

        .drop-shadow-neon { drop-shadow: 0 0 20px rgba(6,182,212,0.8); }
        .shadow-neon-panel { box-shadow: 0 0 80px -10px rgba(6,182,212,0.4), inset 0 0 40px rgba(6,182,212,0.1); }
        .shadow-neon-btn { box-shadow: 0 10px 30px -5px rgba(6,182,212,0.3); }
        .hover\\:shadow-neon-btn-hover:hover { box-shadow: 0 20px 50px -10px rgba(6,182,212,0.6); }
        .shadow-neon-analyze { box-shadow: 0 20px 60px -10px rgba(6,182,212,0.5); }
        .hover\\:shadow-neon-analyze-hover:hover { box-shadow: 0 30px 100px -10px rgba(6,182,212,0.9); }
        .shadow-neon-card { box-shadow: 0 0 60px -10px rgba(6,182,212,0.3); }
        .shadow-neon-icon { box-shadow: 0 0 30px rgba(6,182,212,0.6); }
        .shadow-neon-dot { box-shadow: 0 0 20px currentColor; }
      `}</style>
    </main>
  );
}