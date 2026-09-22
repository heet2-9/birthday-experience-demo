"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { HeroStage } from "@/types";
import { AudioPlayer } from "./AudioPlayer";

interface HeroLauncherProps {
  stage: HeroStage;
  onLaunch: () => void;
}

export function HeroLauncher({ stage, onLaunch }: HeroLauncherProps) {
  return (
    <motion.div
      key="launcher"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }}
      className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-lg"
    >
      <div className="text-center space-y-0.5 mt-0.5">
        <h1 className="font-serif text-xl sm:text-3xl md:text-4xl text-white tracking-tight">
          Let&apos;s{" "}
          <span className="italic text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-light text-glow">
            Celebrate
          </span>
        </h1>
        <p className="font-mono text-[8px] sm:text-[10px] text-neutral-400 uppercase tracking-widest">
          {stage === "idle"
            ? "Click the rocket to begin the celebration"
            : "Liftoff initiated..."}
        </p>
      </div>

      <motion.button
        aria-label="Launch Rocket Celebration"
        animate={
          stage === "launching"
            ? { y: -1000, scale: 0.5, opacity: 0, transition: { duration: 1.5, ease: "easeIn" } }
            : { y: [0, -5, 0] }
        }
        transition={stage === "idle" ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}}
        whileHover={stage === "idle" ? { scale: 1.06 } : {}}
        onClick={onLaunch}
        className="glass-panel p-3 sm:p-4 rounded-full cursor-pointer flex items-center justify-center text-accent box-glow bg-accent/5 border border-accent/20 relative group my-0.5"
      >
        <motion.div
          animate={stage === "launching" ? { x: [-3, 3, -3, 3, 0], y: [2, -2, 2, -2, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Rocket className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
        </motion.div>

        {stage === "launching" && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 2 }}
            className="absolute -bottom-8 w-5 h-14 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent blur-md rounded-full"
          />
        )}
      </motion.button>

      <AudioPlayer />
    </motion.div>
  );
}
