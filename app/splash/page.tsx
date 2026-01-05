"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/home"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-neutral-950 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- Background Textures (The "Premium" Feel) --- */}
      
      {/* 1. Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 2. Top Spotlight / Aurora Effect */}
      {/* This breaks the "plain black" by adding a faint light source at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* 3. Vignette (Darkens edges to focus attention on center) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,transparent,black)] pointer-events-none" />


      {/* --- Center Content --- */}

      {/* Breathing Logo Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="z-10 relative group"
      >
        {/* Glow behind the icon */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
        
        {/* Main Icon Circle - Dark Grey with Glass border */}
        <div className="relative bg-neutral-900 border border-neutral-800 p-8 rounded-full shadow-2xl ring-1 ring-white/5">
          <Activity size={80} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]" />
        </div>
      </motion.div>

      {/* Text Animation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-10 text-center mt-12"
      >
        <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
          AI Health Co-Pilot
        </h1>
        
        {/* Subtitle Badge Style */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
          <p className="text-neutral-400 text-sm font-medium tracking-wide">
            PREMIUM INGREDIENT ANALYSIS
          </p>
        </div>
      </motion.div>
    </main>
  );
}
