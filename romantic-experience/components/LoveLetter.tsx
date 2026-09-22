"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { LoveLetterStage } from "@/types";
import { safeConfetti } from "@/lib/confetti";
import { TypewriterIntro } from "./love-letter/TypewriterIntro";
import { GiftBoxUnboxing } from "./love-letter/GiftBoxUnboxing";
import { EnvelopeCard } from "./love-letter/EnvelopeCard";

export default function LoveLetter() {
  const [stage, setStage] = useState<LoveLetterStage>("intro");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  const triggerConfetti = useCallback(() => {
    safeConfetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#ff2a85", "#ff73b3", "#ffffff", "#f5efe2"],
    });
  }, []);

  const handleEnvelopeClick = useCallback(() => {
    if (stage !== "envelope") return;

    safeConfetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.55 },
      colors: ["#FFD700", "#ff2a85", "#ffffff"],
      startVelocity: 18,
      disableForReducedMotion: true,
    });

    setStage("opening");
    setTimeout(() => {
      setStage("sliding");
      setTimeout(() => {
        setStage("unfolding");
        setTimeout(() => {
          setStage("letterOpen");
        }, 800);
      }, 800);
    }, 700);
  }, [stage]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 relative bg-[#030303] py-20 overflow-hidden"
    >
      <motion.div
        animate={{
          scale: stage === "letterOpen" ? 1.2 : 1,
          opacity: stage === "letterOpen" ? 0.2 : 0.1,
        }}
        transition={{ duration: 1.5 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-[#ff2a85] blur-[160px] pointer-events-none z-0"
      />

      {stage !== "intro" && (
        <div className="text-center space-y-3 mb-12 z-10 max-w-md">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-3xl md:text-5xl text-white tracking-tight"
          >
            {stage === "letterOpen" ? (
              <>
                From the<span className="italic text-[#ff2a85] text-glow"> Heart</span>
              </>
            ) : (
              <>
                A Letter for<span className="italic text-[#ff2a85] text-glow"> Emma ✨</span>
              </>
            )}
          </motion.h3>
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            {stage === "outerBox" && "Unwrap the first layer of my heart ✨"}
            {stage === "innerBox" && "Look deeper... every layer is yours ✦"}
            {stage === "envelope" && "Tap the golden seal to read your letter ✨"}
            {(stage === "opening" || stage === "sliding" || stage === "unfolding") &&
              "Unfolding a message meant only for you..."}
            {stage === "letterOpen" && "Always and forever yours"}
          </p>
        </div>
      )}

      <div className="relative flex items-center justify-center w-full max-w-lg min-h-[480px] z-10 perspective-[1400px]">
        {stage === "intro" && (
          <TypewriterIntro isInView={isInView} onComplete={() => setStage("outerBox")} />
        )}

        {(stage === "outerBox" || stage === "innerBox") && (
          <GiftBoxUnboxing
            stage={stage}
            onOpenOuter={() => {
              setStage("innerBox");
              triggerConfetti();
            }}
            onOpenInner={() => {
              setStage("envelope");
              triggerConfetti();
            }}
          />
        )}

        {stage !== "intro" && stage !== "outerBox" && stage !== "innerBox" && (
          <EnvelopeCard stage={stage} onEnvelopeClick={handleEnvelopeClick} />
        )}
      </div>
    </section>
  );
}