"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CameraViewfinderProps {
  stage: string;
  mousePos: { x: number; y: number };
  isFlashing: boolean;
  onShutter: () => void;
}

export function CameraViewfinder({ stage, mousePos, isFlashing, onShutter }: CameraViewfinderProps) {
  return (
    <motion.div
      animate={{
        rotateY: mousePos.x,
        rotateX: -mousePos.y,
        scale: isFlashing ? 0.95 : 1,
        y: stage === "developing" ? -30 : 0,
      }}
      transition={{ type: "spring", stiffness: 70, damping: 20, mass: 0.5 }}
      className="relative z-20"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="w-[220px] h-[150px] xs:w-[260px] xs:h-[180px] sm:w-[300px] sm:h-[210px] md:w-[340px] md:h-[240px] bg-gradient-to-b from-[#f4efe6] to-[#d5cec4] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative border border-[#fff]/20 overflow-hidden flex flex-col items-center">
        <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-2.5 sm:w-3 bg-gradient-to-b from-red-400 via-yellow-400 to-blue-400 opacity-80" />

        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-9 sm:w-12 h-6 sm:h-8 rounded-md bg-gradient-to-br from-white/40 to-white/5 border border-white/40 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] overflow-hidden">
          <motion.div
            animate={{ opacity: isFlashing ? [0, 1, 0] : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white"
          />
        </div>

        <button
          onClick={onShutter}
          disabled={stage !== "intro"}
          aria-label="Trigger Camera Shutter to Develop Memory"
          className="absolute -top-3 right-6 sm:right-8 w-8 sm:w-10 h-5 sm:h-6 bg-gradient-to-b from-[#ff2a85] to-[#ba1c5c] rounded-t-lg shadow-[0_-2px_10px_rgba(255,42,133,0.4)] border-t border-white/40 cursor-pointer active:translate-y-2 transition-transform hover:brightness-110 disabled:cursor-not-allowed"
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-22 h-22 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#111] to-[#000] rounded-full border-[4px] sm:border-[6px] border-[#222] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,1)] flex items-center justify-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border border-[#333] flex items-center justify-center bg-gradient-to-tr from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]">
            <div className="absolute top-1.5 left-3 sm:top-2 sm:left-4 w-8 sm:w-12 h-4 sm:h-6 bg-white/10 rounded-full blur-[2px] rotate-45" />
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#050505] shadow-[inset_0_0_15px_rgba(0,0,0,1)]" />
          </div>
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-32 sm:w-48 h-1.5 sm:h-2 bg-gradient-to-b from-black to-[#222] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)]" />
      </div>
    </motion.div>
  );
}
