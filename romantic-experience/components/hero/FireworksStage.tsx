"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HERO_EMOJIS } from "@/data/story";

const STARS = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  top: `${(i * 23) % 100}%`,
  delay: (i % 5) * 0.4,
  duration: 1.5 + (i % 3) * 0.5,
}));

const DUST = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${(i * 13) % 100}%`,
  delay: (i % 6) * 0.5,
  duration: 8 + (i % 4) * 2,
  size: 1.5 + (i % 3),
}));

const EARLY_EMOJIS = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  emoji: HERO_EMOJIS[i % HERO_EMOJIS.length],
  left: `${i % 2 === 0 ? 2 + i * 2 : 82 + (i - 1) * 2}%`,
  delay: 0.1 + i * 0.08,
  duration: 4.5 + (i % 3) * 0.5,
  rotation: (i % 2 === 0 ? 1 : -1) * 25,
}));

export function FireworksStage() {
  return (
    <motion.div
      key="fireworks-text"
      className="text-center flex flex-col items-center justify-center space-y-3 sm:space-y-6 w-full px-2"
    >
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed inset-0 bg-white z-50 pointer-events-none mix-blend-overlay"
      />

      {DUST.map((p) => (
        <div
          key={`dust-${p.id}`}
          className="absolute rounded-full bg-accent z-10 pointer-events-none shadow-[0_0_8px_rgba(255,42,133,0.8)] animate-float-up"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--duration": `${p.duration}s`,
            "--delay": `${p.delay}s`,
            "--drift": "30px",
          } as React.CSSProperties}
        />
      ))}

      {STARS.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute w-1 h-1 bg-white rounded-full z-10 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-twinkle"
          style={{
            left: s.left,
            top: s.top,
            "--duration": `${s.duration}s`,
            "--delay": `${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {EARLY_EMOJIS.map((e) => (
        <div
          key={`emoji-${e.id}`}
          className="absolute text-xl sm:text-2xl md:text-3xl z-10 pointer-events-none drop-shadow-lg animate-float-up"
          style={{
            left: e.left,
            "--duration": `${e.duration}s`,
            "--delay": `${e.delay}s`,
            "--rot": `${e.rotation}deg`,
          } as React.CSSProperties}
        >
          {e.emoji}
        </div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.5, rotate: -20 }}
        animate={{ opacity: [0, 1, 1, 0], x: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 4, delay: 0.5, ease: "easeOut" }}
        className="absolute left-2 sm:left-6 md:left-12 bottom-12 sm:bottom-20 text-3xl sm:text-5xl z-10 pointer-events-none drop-shadow-xl"
      >
        🎁
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.5, rotate: 20 }}
        animate={{ opacity: [0, 1, 1, 0], x: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 4, delay: 0.8, ease: "easeOut" }}
        className="absolute right-2 sm:right-6 md:right-12 top-16 sm:top-32 text-4xl sm:text-6xl z-10 pointer-events-none drop-shadow-xl"
      >
        🎁
      </motion.div>

      {/* HEADING TEXT */}
      <div className="relative z-30 flex flex-col items-center max-w-full px-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] sm:inset-[-40px] pointer-events-none z-50 rounded-full"
        >
          <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
          <Sparkles className="absolute bottom-0 right-1/4 w-4 h-4 sm:w-6 sm:h-6 text-accent drop-shadow-[0_0_10px_rgba(255,42,133,1)]" />
        </motion.div>

        <motion.h2
          initial={{ scale: 0.1, opacity: 0, filter: "blur(20px)" }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            textShadow: [
              "0 0 20px rgba(255, 255, 255, 0.4)",
              "0 0 60px rgba(255, 255, 255, 0.8)",
              "0 0 20px rgba(255, 255, 255, 0.4)",
            ],
          }}
          transition={{
            scale: { type: "spring", stiffness: 40, damping: 12, delay: 0.2 },
            textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          className="font-serif text-3xl xs:text-4xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold text-white tracking-tight leading-none text-glow mt-6 sm:mt-12 relative overflow-hidden"
        >
          HAPPY
          <br />
          BIRTHDAY
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 mix-blend-overlay pointer-events-none"
          />
        </motion.h2>

        <motion.div
          initial={{ scale: 0.1, opacity: 0, filter: "blur(20px)" }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            textShadow: [
              "0 0 30px rgba(255, 42, 133, 0.6)",
              "0 0 80px rgba(255, 42, 133, 1)",
              "0 0 30px rgba(255, 42, 133, 0.6)",
            ],
          }}
          transition={{
            scale: { type: "spring", stiffness: 40, damping: 12, delay: 0.6 },
            textShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
          className="font-serif text-4xl xs:text-5xl sm:text-8xl md:text-9xl lg:text-[9rem] font-bold text-accent tracking-tighter leading-none box-glow relative overflow-hidden"
        >
          EMMA
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 mix-blend-overlay pointer-events-none"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
