"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity } from "lucide-react"; // Using a Lucide icon as logo placeholder

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/home"), 2500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-medical-mesh opacity-50" />

      {/* Breathing Logo Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="z-10 bg-white p-6 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.3)]"
      >
        <Activity size={80} className="text-blue-500" />
      </motion.div>

      {/* Text Animation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-10 text-center mt-8"
      >
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          AI Health Co-Pilot
        </h1>
        <p className="text-slate-500 mt-2 text-lg font-medium">
          Premium Ingredient Analysis
        </p>
      </motion.div>
    </main>
  );
}