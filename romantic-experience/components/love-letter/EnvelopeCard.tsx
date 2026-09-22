"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { LoveLetterStage } from "@/types";
import { LetterText } from "./LetterText";

interface EnvelopeCardProps {
  stage: LoveLetterStage;
  onEnvelopeClick: () => void;
}

export function EnvelopeCard({ stage, onEnvelopeClick }: EnvelopeCardProps) {
  const springTransition = { type: "spring", stiffness: 50, damping: 14 };

  return (
    <motion.div
      key="envelope-stage"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springTransition}
      className="relative flex items-center justify-center w-full"
    >
      {/* Floating Sparkles */}
      <div className="absolute inset-0 -m-12 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            className="absolute w-1.5 h-1.5 bg-[#FFD700] rounded-full shadow-[0_0_8px_#FFD700]"
            style={{
              left: `${20 + i * 12}%`,
              top: `${25 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      {/* FROSTED GLASS ENVELOPE */}
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={stage === "envelope" ? { scale: 1.02, y: -6 } : {}}
        onClick={onEnvelopeClick}
        className={`relative w-[340px] sm:w-[420px] h-[250px] rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col justify-between overflow-visible transition-all duration-300 ${
          stage === "envelope"
            ? "cursor-pointer hover:border-[#ff2a85]/50 hover:shadow-[0_0_40px_rgba(255,42,133,0.3)]"
            : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-2xl border border-[#ff2a85]/20 pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff2a85]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Flap */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={{ rotateX: stage !== "envelope" ? -180 : 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-0 left-0 right-0 h-[120px] bg-white/[0.08] backdrop-blur-3xl border-b border-white/20 rounded-t-2xl z-30 shadow-lg flex justify-center items-center"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
          }}
        >
          <AnimatePresence>
            {stage === "envelope" && (
              <motion.div
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-2 w-10 h-10 rounded-full bg-gradient-to-br from-[#ffffff] via-[#f5efe2] to-[#ff2a85]/30 border border-white/40 shadow-[0_0_20px_rgba(255,42,133,0.4)] flex items-center justify-center cursor-pointer z-40"
              >
                <Sparkles className="w-4 h-4 text-[#ff2a85]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* INVITATION CARD */}
        <motion.div
          initial={{ y: 0, scale: 0.95, opacity: 0 }}
          animate={{
            y: stage === "envelope" || stage === "opening" ? 0 : stage === "sliding" ? -170 : -30,
            scale: stage === "unfolding" || stage === "letterOpen" ? 1 : 0.95,
            opacity: stage === "envelope" ? 0 : 1,
            zIndex: stage === "sliding" || stage === "unfolding" || stage === "letterOpen" ? 50 : 5,
          }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="absolute left-3 right-3 top-3 bg-[#fdfbf7] rounded-xl border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 text-stone-800 text-left overflow-hidden max-h-[75vh]"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-70" />
          <LetterText stage={stage} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
