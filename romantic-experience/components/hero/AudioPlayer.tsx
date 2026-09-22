"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

const PLAYER_BG_IMAGE = "/images/music-player-bg.jpeg";
const VISUALIZER_BARS = [8, 15, 10, 18, 9, 21, 13, 24, 12, 17, 10, 20, 15, 10, 17, 8];

export function AudioPlayer() {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    volume,
    showVolumeSlider,
    setShowVolumeSlider,
    togglePlay,
    toggleMute,
    handleSeek,
    handleVolumeChange,
    formatTime,
  } = useAudio("/sounds/Apna Bana le.mp3");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full flex justify-center items-center relative select-none mt-0.5"
    >
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.12, 1] : 1,
          opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.18,
        }}
        transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
        className="absolute w-[180px] sm:w-[200px] h-[220px] sm:h-[240px] rounded-2xl bg-gradient-to-tr from-[#ff2a85] via-amber-400/20 to-transparent blur-[50px] sm:blur-[60px] pointer-events-none z-0"
      />

      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.02, y: -3 }}
        className="relative w-[170px] xs:w-[185px] sm:w-[200px] rounded-2xl bg-[#0d0d0d]/85 backdrop-blur-2xl border border-white/20 p-2 sm:p-3 shadow-[0_18px_50px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.3)] z-20 overflow-hidden flex flex-col items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:border-[#ff2a85]/40 hover:shadow-[0_0_24px_rgba(255,42,133,0.25)]"
      >
        <div className="absolute inset-1 rounded-[13px] border border-[#FFD700]/30 pointer-events-none z-10" />

        <motion.div
          animate={{ x: ["-100%", "250%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12 pointer-events-none z-30"
        />

        <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.8)] border border-white/20 z-20 bg-black/40">
          <Image
            src={PLAYER_BG_IMAGE}
            alt="Keepsake Photo"
            fill
            sizes="(max-width: 640px) 170px, 200px"
            quality={75}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none" />
        </div>

        <div className="text-center space-y-0.5 w-full z-20 px-0.5">
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="w-2 h-2 text-[#ff2a85]" />
            <h2 className="font-serif text-[11px] xs:text-xs sm:text-sm text-white tracking-tight font-semibold">
              For Emma <span className="text-[#ff2a85]">❤️</span>
            </h2>
            <Sparkles className="w-2 h-2 text-[#ff2a85]" />
          </div>
          <p className="font-mono text-[6.5px] sm:text-[7.5px] text-amber-200/80 uppercase tracking-[0.16em]">
            Birthday Symphony • Dedicated to Emma
          </p>
        </div>

        <div className="w-full space-y-0.5 z-20 px-0.5">
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Audio Seek Time"
              className="w-full h-0.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#ff2a85] focus:outline-none shadow-sm"
            />
          </div>
          <div className="flex justify-between items-center text-[7px] sm:text-[7.5px] font-mono text-neutral-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full z-20 px-1 pt-0.5">
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="p-0.5 text-neutral-300 hover:text-[#ff2a85] transition-colors duration-200"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3 h-3 text-[#ff2a85]" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, x: -5, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="absolute left-5 bg-black/90 border border-white/20 rounded-full px-1.5 py-0.5 flex items-center shadow-xl z-50 backdrop-blur-md"
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume Slider"
                    className="w-10 h-0.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#ff2a85]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous Track"
              className="p-0.5 text-neutral-300 hover:text-white transition-colors"
            >
              <SkipBack className="w-3 h-3" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Music" : "Play Music"}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-white via-amber-100 to-[#ff2a85] text-black flex items-center justify-center shadow-[0_0_12px_rgba(255,42,133,0.5)] hover:shadow-[0_0_20px_rgba(255,42,133,0.8)] transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 fill-black" />
              ) : (
                <Play className="w-3 h-3 fill-black ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next Track"
              className="p-0.5 text-neutral-300 hover:text-white transition-colors"
            >
              <SkipForward className="w-3 h-3" />
            </motion.button>
          </div>

          <div className="w-4" />
        </div>

        <div className="w-full flex items-center justify-center gap-0.5 pt-0.5 pb-0.5 z-20 h-6">
          {VISUALIZER_BARS.map((height, idx) => (
            <div
              key={idx}
              className={`w-0.5 rounded-full bg-gradient-to-t from-[#ff2a85] via-pink-300 to-[#FFD700] shadow-[0_0_3px_rgba(255,42,133,0.6)] ${isPlaying ? "animate-bar-pulse" : "opacity-35"
                }`}
              style={{
                height: `${height}px`,
                animationDuration: `${0.4 + (idx % 5) * 0.1}s`,
                animationDelay: `${idx * 0.05}s`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
