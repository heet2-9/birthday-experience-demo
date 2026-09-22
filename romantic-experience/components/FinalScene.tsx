"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { safeConfetti } from "@/lib/confetti";
import { DriftingPetals } from "./final-scene/DriftingPetals";
import { FloralsBouquet } from "./final-scene/FloralsBouquet";

export default function FinalScene() {
  const [hasFlowerClicked, setHasFlowerClicked] = useState(false);

  const handleFlowerClick = useCallback(() => {
    setHasFlowerClicked(true);
    safeConfetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#ff2a85", "#ffffff", "#ff73b3", "#f5efe2", "#ffa500"],
    });
  }, []);

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative py-12 sm:py-16 px-4 bg-[#030303] overflow-hidden text-center select-none">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.18, 0.35, 0.18],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full bg-gradient-to-tr from-[#FFD700]/20 via-[#ff2a85]/20 to-amber-400/10 blur-[140px] sm:blur-[190px] pointer-events-none z-0"
      />

      <DriftingPetals />

      <div className="relative z-20 max-w-2xl space-y-6 sm:space-y-8 px-2">
        <FloralsBouquet
          hasFlowerClicked={hasFlowerClicked}
          onFlowerClick={handleFlowerClick}
        />

        <div className="space-y-3 sm:space-y-4 pt-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-white tracking-tight"
          >
            Happy Birthday,<span className="italic text-[#ff2a85] text-glow"> Emma 🌻❤️</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-serif text-base sm:text-xl text-neutral-300 italic max-w-lg mx-auto leading-relaxed"
          >
            &ldquo;Wishing the happiest of birthdays to someone truly special ✨&rdquo;
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pt-6 border-t border-white/10 max-w-sm mx-auto flex flex-col items-center gap-4"
        >
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            {hasFlowerClicked
              ? "A bouquet that blooms forever 🌻💖"
              : "Tap the central sunflower to bloom your bouquet ✨"}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Relive The Story</span>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {hasFlowerClicked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.9, 2.4] }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute pointer-events-none z-30"
          >
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#FFD700]/20 blur-xl border-2 border-[#FFD700]/40" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}