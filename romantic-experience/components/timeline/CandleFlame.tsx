"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WishStage } from "@/types";

interface CandleFlameProps {
  stage: WishStage;
}

export function CandleFlame({ stage }: CandleFlameProps) {
  const isLit = stage === "idle" || stage === "holding";

  return (
    <>
      {/* Lit Candle Flame */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            key="flame"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, y: -15, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute -top-14 flex flex-col items-center justify-end h-16 w-10 pointer-events-none"
          >
            {/* Soft Ambient Candle Glow */}
            <motion.div
              animate={{
                scale: stage === "holding" ? [1.5, 1.8, 1.6] : [1, 1.25, 1],
                opacity: stage === "holding" ? [0.6, 0.8, 0.6] : [0.35, 0.55, 0.35],
              }}
              transition={{ duration: 0.2 + Math.random() * 0.1, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute bottom-2 w-12 h-12 rounded-full blur-[12px] ${
                stage === "holding" ? "bg-amber-400" : "bg-orange-500"
              }`}
            />

            {/* Main Outer Flame Shape */}
            <motion.div
              animate={{
                y: stage === "holding" ? [0, -6, 0] : [0, -3, 0],
                scale: stage === "holding" ? [1, 1.3, 1] : [1, 1.08, 1],
                rotate: [-2, 2, -1],
              }}
              transition={{ duration: 0.15 + Math.random() * 0.1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1 w-4 h-10 bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent rounded-[50%_50%_20%_20%] shadow-[0_0_12px_rgba(251,191,36,0.7)] z-10"
              style={{ borderRadius: "50% 50% 20% 20% / 60% 60% 20% 20%" }}
            />

            {/* Inner Flame Core */}
            <motion.div
              animate={{ y: [0, -1.5, 0] }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="absolute bottom-2 w-1.5 h-4 bg-white rounded-full blur-[1px] z-20 shadow-[0_0_6px_rgba(255,255,255,1)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realistic Smoke Puff Animation after Flames are Extinguished */}
      <AnimatePresence>
        {!isLit && (
          <motion.div key="smoke" className="absolute -top-12 flex flex-col items-center pointer-events-none z-30">
            {/* Main Rising Smoke Tendril */}
            <motion.div
              initial={{ opacity: 0.9, y: 0, scale: 0.4, x: 0 }}
              animate={{
                opacity: [0.9, 0.7, 0.3, 0],
                y: -95,
                scale: [0.4, 1.8, 2.8, 3.5],
                filter: ["blur(2px)", "blur(6px)", "blur(12px)"],
                x: [0, -12, 14, -8],
              }}
              transition={{ duration: 2.8, ease: "easeOut" }}
              className="w-3.5 h-12 bg-gradient-to-t from-neutral-200/60 via-neutral-300/40 to-transparent rounded-full"
            />

            {/* Secondary Wispy Smoke Trail */}
            <motion.div
              initial={{ opacity: 0.7, y: 2, scale: 0.3, x: 0 }}
              animate={{
                opacity: [0.7, 0.4, 0],
                y: -65,
                scale: [0.3, 1.4, 2.2],
                filter: ["blur(1px)", "blur(5px)", "blur(9px)"],
                x: [0, 8, -6],
              }}
              transition={{ duration: 2.2, delay: 0.15, ease: "easeOut" }}
              className="w-2.5 h-8 bg-neutral-400/50 rounded-full absolute"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
