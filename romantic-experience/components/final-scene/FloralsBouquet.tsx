"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface FloralsBouquetProps {
  hasFlowerClicked: boolean;
  onFlowerClick: () => void;
}

function FloralsBouquetComponent({ hasFlowerClicked, onFlowerClick }: FloralsBouquetProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] pt-4">
      <div className="relative flex items-center justify-center w-full">
        {/* Stem Wrapper / Ribbon Base */}
        <motion.div
          animate={{
            y: hasFlowerClicked ? [0, -4, 0] : 0,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-28px] z-20 flex flex-col items-center"
        >
          <div className="w-6 h-14 bg-gradient-to-b from-emerald-700 via-green-800 to-emerald-950 rounded-b-md shadow-md border-x border-green-600/30" />
          <div className="absolute top-1 w-12 h-6 bg-gradient-to-r from-amber-400 via-[#FFD700] to-amber-500 rounded-full border border-white/60 shadow-[0_0_12px_rgba(255,215,0,0.8)] flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-700 rounded-full border border-white/40" />
          </div>
        </motion.div>

        {/* 1. Left Supporting Mini Sunflower */}
        <motion.div
          animate={{
            x: hasFlowerClicked ? -70 : -35,
            y: hasFlowerClicked ? -45 : -15,
            scale: hasFlowerClicked ? 0.85 : 0.65,
            rotate: hasFlowerClicked ? -25 : -12,
          }}
          transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
          className="absolute z-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
        >
          <SunflowerSVG size="w-16 h-16 sm:w-20 sm:h-20" />
        </motion.div>

        {/* 2. Right Supporting Mini Sunflower */}
        <motion.div
          animate={{
            x: hasFlowerClicked ? 70 : 35,
            y: hasFlowerClicked ? -45 : -15,
            scale: hasFlowerClicked ? 0.85 : 0.65,
            rotate: hasFlowerClicked ? 25 : 12,
          }}
          transition={{ duration: 1.2, type: "spring", stiffness: 60, delay: 0.05 }}
          className="absolute z-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
        >
          <SunflowerSVG size="w-16 h-16 sm:w-20 sm:h-20" />
        </motion.div>

        {/* 3. Top Accent Mini Sunflower */}
        <motion.div
          animate={{
            y: hasFlowerClicked ? -95 : -50,
            scale: hasFlowerClicked ? 0.8 : 0.55,
            rotate: hasFlowerClicked ? [0, 10, -10, 0] : 0,
          }}
          transition={{ duration: 1.3, type: "spring", delay: 0.1 }}
          className="absolute z-0 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
        >
          <SunflowerSVG size="w-14 h-14 sm:w-18 sm:h-18" />
        </motion.div>

        {/* 4. Far Left Deep Rose */}
        <motion.div
          animate={{
            x: hasFlowerClicked ? -105 : -48,
            y: hasFlowerClicked ? -10 : 5,
            scale: hasFlowerClicked ? 0.85 : 0.45,
            rotate: -35,
          }}
          transition={{ duration: 1.4, type: "spring", delay: 0.15 }}
          className="absolute z-0 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]"
        >
          <RoseSVG />
        </motion.div>

        {/* 5. Far Right Golden Tulip */}
        <motion.div
          animate={{
            x: hasFlowerClicked ? 105 : 48,
            y: hasFlowerClicked ? -10 : 5,
            scale: hasFlowerClicked ? 0.85 : 0.45,
            rotate: 35,
          }}
          transition={{ duration: 1.4, type: "spring", delay: 0.2 }}
          className="absolute z-0 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
        >
          <TulipSVG />
        </motion.div>

        {/* 6. Bottom Left White Daisy */}
        <motion.div
          animate={{
            x: hasFlowerClicked ? -55 : -25,
            y: hasFlowerClicked ? 25 : 15,
            scale: hasFlowerClicked ? 0.75 : 0.4,
            rotate: -20,
          }}
          transition={{ duration: 1.4, type: "spring", delay: 0.22 }}
          className="absolute z-0 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
        >
          <DaisySVG />
        </motion.div>

        {/* 7. Bottom Right Lavender Sprig */}
        <motion.div
          animate={{
            x: hasFlowerClicked ? 55 : 25,
            y: hasFlowerClicked ? 25 : 15,
            scale: hasFlowerClicked ? 0.75 : 0.4,
            rotate: 20,
          }}
          transition={{ duration: 1.4, type: "spring", delay: 0.25 }}
          className="absolute z-0 text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]"
        >
          <LavenderSVG />
        </motion.div>

        {/* CENTRAL INTERACTIVE SUNFLOWER BUTTON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-30 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.12, rotate: 15 }}
            whileTap={{ scale: 0.92 }}
            onClick={onFlowerClick}
            aria-label="Bloom Everlasting Sunflower Bouquet"
            className="cursor-pointer relative p-3 sm:p-4 rounded-full bg-black/50 backdrop-blur-md border border-[#FFD700]/40 shadow-[0_0_50px_rgba(255,215,0,0.5)] group transition-all"
          >
            <SunflowerSVG size="w-24 h-24 sm:w-32 sm:h-32" />
            <Sparkles className="absolute top-2 right-2 w-6 h-6 text-amber-200 animate-pulse pointer-events-none" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export const FloralsBouquet = memo(FloralsBouquetComponent);

function SunflowerSVG({ size = "w-20 h-20" }: { size?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={size}>
      {[...Array(16)].map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="20"
          rx="5.5"
          ry="18"
          fill="#FFD700"
          transform={`rotate(${i * 22.5} 50 50)`}
        />
      ))}
      {[...Array(12)].map((_, i) => (
        <ellipse
          key={`inner-${i}`}
          cx="50"
          cy="26"
          rx="4"
          ry="12"
          fill="#FFA500"
          transform={`rotate(${i * 30 + 15} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="16" fill="#3D2314" />
      <circle cx="50" cy="50" r="14" fill="#2A160A" stroke="#52311D" strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  );
}

function RoseSVG() {
  return (
    <svg width="70" height="70" viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
      <path d="M50 15 C30 15 20 35 20 50 C20 70 35 85 50 85 C65 85 80 70 80 50 C80 35 70 15 50 15 Z" fill="#E11D48" />
      <path d="M50 25 C38 25 30 38 30 50 C30 62 40 72 50 72 C60 72 70 62 70 50 C70 38 62 25 50 25 Z" fill="#F43F5E" />
      <path d="M50 35 C42 35 36 42 36 50 C36 58 43 62 50 62 C57 62 64 58 64 50 C64 42 58 35 50 35 Z" fill="#FB7185" />
      <circle cx="50" cy="50" r="6" fill="#FFE4E6" />
    </svg>
  );
}

function TulipSVG() {
  return (
    <svg width="65" height="65" viewBox="0 0 100 100" className="w-12 h-12 sm:w-16 sm:h-16">
      <path d="M50 20 C25 20 20 60 30 85 C45 90 55 90 70 85 C80 60 75 20 50 20 Z" fill="#F59E0B" />
      <path d="M50 20 C40 35 35 60 50 85 C65 60 60 35 50 20 Z" fill="#FBBF24" />
      <path d="M30 85 C40 50 45 30 50 20 C35 30 25 55 30 85 Z" fill="#D97706" />
    </svg>
  );
}

function DaisySVG() {
  return (
    <svg width="60" height="60" viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14">
      {[...Array(12)].map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="22"
          rx="6"
          ry="16"
          fill="#FFFFFF"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill="#FBBF24" />
    </svg>
  );
}

function LavenderSVG() {
  return (
    <svg width="60" height="60" viewBox="0 0 100 100" className="w-10 h-10 sm:w-14 sm:h-14">
      <path d="M50 90 L50 20" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />
      {[...Array(6)].map((_, i) => (
        <g key={i} transform={`translate(0, ${-i * 10})`}>
          <circle cx="44" cy="60" r="5" fill="#A855F7" />
          <circle cx="56" cy="60" r="5" fill="#C084FC" />
          <circle cx="50" cy="55" r="4" fill="#E9D5FF" />
        </g>
      ))}
    </svg>
  );
}
