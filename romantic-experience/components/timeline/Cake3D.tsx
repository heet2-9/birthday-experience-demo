"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { WishStage } from "@/types";
import { CandleFlame } from "./CandleFlame";

interface Cake3DProps {
  stage: WishStage;
  onCakeClick?: () => void;
}

function Cake3DComponent({ stage, onCakeClick }: Cake3DProps) {
  const sparkles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${20 + (i * 5) % 60}%`,
      top: `${20 + (i * 7) % 60}%`,
      duration: 3 + (i % 3),
      delay: (i % 4) * 0.8,
    }));
  }, []);

  const isExtinguished = stage === "darkness" || stage === "revealed";

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg z-20 pointer-events-none mb-6 md:mb-10">
      {/* Shimmering Particles */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        {sparkles.map((sp) => (
          <motion.div
            key={`sparkle-${sp.id}`}
            animate={{
              y: [0, -30, -60],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: sp.duration,
              repeat: Infinity,
              delay: sp.delay,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,1)]"
            style={{
              left: sp.left,
              top: sp.top,
            }}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center scale-[0.85] md:scale-100 mt-4 md:mt-8"
      >
        {/* Candles Container with Tap / Click to Blow Out Interaction */}
        <div
          onClick={onCakeClick}
          className="relative z-50 flex justify-center gap-8 mb-[-12px] pointer-events-auto cursor-pointer group"
          title="Tap to blow out candles"
        >
          {[1, 2, 3].map((candle, idx) => (
            <motion.div
              key={`candle-${candle}`}
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 3 + idx, repeat: Infinity, ease: "easeInOut", delay: idx }}
              className="relative flex flex-col items-center"
            >
              <CandleFlame stage={stage} />

              {/* Candle Wick with Darkening Effect */}
              <motion.div
                animate={{
                  backgroundColor: isExtinguished ? "#171717" : "#525252",
                  boxShadow: isExtinguished
                    ? "0 0 2px rgba(0,0,0,0.9)"
                    : "0 0 4px rgba(251,191,36,0.6)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-0.5 h-2.5 rounded-t-full -mb-0.5 z-30 group-hover:scale-110 transition-transform"
              />

              {/* Candle Body */}
              <div className="w-2.5 h-16 bg-gradient-to-r from-[#ffe4e1] via-white to-[#f5c6cb] rounded-t-sm shadow-md z-20 overflow-hidden relative border border-white/50 group-hover:border-pink-300 transition-colors">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_4px,rgba(255,42,133,0.35)_4px,rgba(255,42,133,0.35)_8px)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* TOP TIER */}
        <div
          onClick={onCakeClick}
          className="relative z-40 flex flex-col items-center pointer-events-auto cursor-pointer"
        >
          <div className="w-36 h-14 bg-gradient-to-b from-[#ffffff] to-[#faf5f0] rounded-[50%] border border-white shadow-[inset_0_-3px_6px_rgba(0,0,0,0.04)] absolute -top-7 z-20" />
          <div className="w-36 h-20 bg-gradient-to-r from-[#e8dfd8] via-[#ffffff] to-[#d6c7b8] rounded-b-[50%] shadow-[0_15px_25px_rgba(0,0,0,0.25)] relative overflow-hidden border-b border-[#c2b2a3]/30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 left-1/4 skew-x-12" />
            <div className="absolute top-0 w-full flex justify-between px-3 opacity-90">
              <div className="w-3 h-7 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-2.5 h-10 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-1" />
              <div className="w-3.5 h-6 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-2 h-8 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-2" />
            </div>
            <div className="absolute bottom-5 w-full h-3 bg-gradient-to-r from-[#cc1a66] via-[#ff2a85] to-[#990a47] shadow-sm opacity-90" />
            <div className="absolute bottom-[26px] left-6 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
            <div className="absolute bottom-[22px] right-8 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
          </div>
          <div className="absolute -bottom-2 w-[105%] flex justify-around px-1 z-30 drop-shadow-md">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white to-[#f0e6d9] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1)]" />
            ))}
          </div>
        </div>

        {/* MIDDLE TIER */}
        <div className="relative z-30 flex flex-col items-center -mt-10">
          <div className="w-52 h-16 bg-gradient-to-b from-[#ffffff] to-[#faf5f0] rounded-[50%] border border-white shadow-[inset_0_-3px_6px_rgba(0,0,0,0.04)] absolute -top-8 z-20" />
          <div className="w-52 h-24 bg-gradient-to-r from-[#e8dfd8] via-[#ffffff] to-[#d6c7b8] rounded-b-[50%] shadow-[0_20px_35px_rgba(0,0,0,0.3)] relative overflow-hidden border-b border-[#c2b2a3]/30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 left-1/4 skew-x-12" />
            <div className="absolute top-0 w-full flex justify-around px-2 opacity-90">
              <div className="w-3 h-9 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-1" />
              <div className="w-4 h-6 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-2.5 h-12 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-3.5 h-7 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-2" />
              <div className="w-3 h-10 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
            </div>
            <div className="absolute bottom-6 w-full h-3.5 bg-gradient-to-r from-[#cc1a66] via-[#ff2a85] to-[#990a47] shadow-sm opacity-90" />
            <div className="absolute bottom-12 left-10 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_4px_rgba(255,215,0,0.8)]" />
            <div className="absolute bottom-10 right-14 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
            <div className="absolute bottom-[30px] right-24 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
          </div>
          <div className="absolute -bottom-2 w-[105%] flex justify-around px-1 z-30 drop-shadow-md">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-white to-[#f0e6d9] shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.1)]" />
            ))}
          </div>
          <div className="absolute -bottom-1 left-2 z-40 flex items-center justify-center drop-shadow-md scale-75">
            <div className="absolute w-4 h-4 bg-gradient-to-br from-pink-200 to-[#ff2a85] rounded-[50%_0_50%_50%] rotate-45 transform -translate-x-2 -translate-y-1" />
            <div className="absolute w-4 h-4 bg-gradient-to-br from-pink-200 to-[#ff2a85] rounded-[50%_50%_0_50%] rotate-45 transform translate-x-2 -translate-y-1" />
            <div className="absolute w-2 h-2 bg-amber-300 rounded-full z-10 shadow-sm" />
          </div>
        </div>

        {/* BOTTOM TIER */}
        <div className="relative z-20 flex flex-col items-center -mt-12">
          <div className="w-72 h-20 bg-gradient-to-b from-[#ffffff] to-[#faf5f0] rounded-[50%] border border-white shadow-[inset_0_-3px_6px_rgba(0,0,0,0.04)] absolute -top-10 z-20" />
          <div className="w-72 h-32 bg-gradient-to-r from-[#e8dfd8] via-[#ffffff] to-[#c7b7a7] rounded-b-[50%] shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden border-b border-[#a39485]/40">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 left-1/4 skew-x-12" />
            <div className="absolute top-0 w-full flex justify-around px-4 opacity-90">
              <div className="w-3 h-14 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-2" />
              <div className="w-4 h-8 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-2.5 h-16 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-4 h-10 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-3" />
              <div className="w-3 h-12 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm" />
              <div className="w-3.5 h-7 bg-gradient-to-b from-white to-[#fdfbf9] rounded-b-full shadow-sm mt-1" />
            </div>
            <div className="absolute bottom-8 w-full h-4 bg-gradient-to-r from-[#cc1a66] via-[#ff2a85] to-[#990a47] shadow-sm opacity-90" />
            <div className="absolute bottom-16 left-12 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_5px_rgba(255,215,0,0.8)]" />
            <div className="absolute bottom-20 left-20 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
            <div className="absolute bottom-14 right-16 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_5px_rgba(255,215,0,0.8)]" />
            <div className="absolute bottom-[42px] right-28 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-yellow-100 to-amber-500 shadow-[0_0_3px_rgba(255,215,0,0.8)]" />
          </div>
          <div className="absolute -bottom-2.5 w-[104%] flex justify-around px-1 z-30 drop-shadow-lg">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-white to-[#f0e6d9] shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.15)]" />
            ))}
          </div>
          <div className="absolute -bottom-2 right-4 z-40 flex items-center justify-center drop-shadow-md scale-90">
            <div className="absolute w-5 h-5 bg-gradient-to-br from-pink-200 to-[#ff2a85] rounded-[50%_0_50%_50%] rotate-45 transform -translate-x-2.5 -translate-y-1.5" />
            <div className="absolute w-5 h-5 bg-gradient-to-br from-pink-200 to-[#ff2a85] rounded-[50%_50%_0_50%] rotate-45 transform translate-x-2.5 -translate-y-1.5" />
            <div className="absolute w-5 h-5 bg-gradient-to-br from-pink-200 to-[#ff2a85] rounded-[50%_50%_50%_0] rotate-45 transform translate-y-2" />
            <div className="absolute w-2.5 h-2.5 bg-amber-300 rounded-full z-10 shadow-sm" />
          </div>
        </div>

        {/* GLASS STAND */}
        <div className="relative z-0 -mt-14">
          <div className="w-[340px] h-28 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-[50%] border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.15)] relative flex justify-center">
            <div className="absolute top-2 w-[95%] h-[90%] rounded-[50%] border border-white/10" />
            <div className="absolute -bottom-6 w-16 h-12 bg-gradient-to-r from-white/5 via-white/20 to-white/5 backdrop-blur-md shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] border-x border-white/10 z-0" />
            <div className="absolute -bottom-10 w-32 h-10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl rounded-[50%] border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export const Cake3D = memo(Cake3DComponent);
