"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { LoveLetterStage } from "@/types";

interface GiftBoxUnboxingProps {
  stage: "outerBox" | "innerBox";
  onOpenOuter: () => void;
  onOpenInner: () => void;
}

export function GiftBoxUnboxing({ stage, onOpenOuter, onOpenInner }: GiftBoxUnboxingProps) {
  const smoothEase = { ease: [0.25, 1, 0.5, 1], duration: 1.2 };
  const springTransition = { type: "spring", stiffness: 50, damping: 14 };

  if (stage === "outerBox") {
    return (
      <motion.div
        key="outer-box"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        transition={smoothEase}
        whileHover={{ scale: 1.05 }}
        onClick={onOpenOuter}
        className="glass-panel p-12 rounded-full cursor-pointer flex items-center justify-center text-[#ff2a85] box-glow bg-[#ff2a85]/5 border border-[#ff2a85]/20 relative group"
      >
        <Gift className="w-20 h-20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105" />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="inner-box"
      initial={{ scale: 0.4, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: -40, filter: "blur(10px)" }}
      transition={springTransition}
      whileHover={{ scale: 1.08 }}
      onClick={onOpenInner}
      className="p-8 rounded-full cursor-pointer flex items-center justify-center text-pink-300 box-glow bg-white/[0.02] border border-white/10 relative group"
    >
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ff2a85] to-pink-300 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-500" />
      <Sparkles className="w-12 h-12 animate-pulse" />
    </motion.div>
  );
}
