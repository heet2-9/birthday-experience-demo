"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BalloonSlotData, HeroStage } from "@/types";
import { NICKNAMES, BALLOON_COLORS } from "@/data/nicknames";
import { useResponsiveSlots } from "@/hooks/useResponsiveSlots";
import { safeConfetti, triggerCelebrationConfetti, triggerPartyPoppers } from "@/lib/confetti";
import { BalloonColumn } from "./hero/BalloonColumn";
import { HeroLauncher } from "./hero/HeroLauncher";
import { FireworksStage } from "./hero/FireworksStage";

export default function Hero() {
  const [stage, setStage] = useState<HeroStage>("idle");
  const fireworkIntervalRef = useRef<number | null>(null);

  const slotCountPerSide = useResponsiveSlots();
  const [poppedBalloons, setPoppedBalloons] = useState<Record<number, boolean>>({});

  const leftSlotData: BalloonSlotData[] = useMemo(() => {
    return Array.from({ length: slotCountPerSide }).map((_, i) => ({
      id: i,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      nickname: NICKNAMES[i % NICKNAMES.length],
      delay: 1.0 + i * 0.2,
    }));
  }, [slotCountPerSide]);

  const rightSlotData: BalloonSlotData[] = useMemo(() => {
    return Array.from({ length: slotCountPerSide }).map((_, i) => ({
      id: i + 10,
      color: BALLOON_COLORS[(i + 2) % BALLOON_COLORS.length],
      nickname: NICKNAMES[(i + slotCountPerSide) % NICKNAMES.length],
      delay: 1.1 + i * 0.2,
    }));
  }, [slotCountPerSide]);

  const startFireworkShow = useCallback(() => {
    if (fireworkIntervalRef.current) {
      window.clearInterval(fireworkIntervalRef.current);
      fireworkIntervalRef.current = null;
    }

    const duration = 3500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 22, spread: 360, ticks: 45, zIndex: 0, disableForReducedMotion: true };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    fireworkIntervalRef.current = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        if (fireworkIntervalRef.current) {
          window.clearInterval(fireworkIntervalRef.current);
          fireworkIntervalRef.current = null;
        }
        return;
      }
      const particleCount = Math.max(10, Math.round(18 * (timeLeft / duration)));
      safeConfetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.35) },
        colors: ["#ff2a85", "#ff73b3", "#ffffff", "#f5efe2", "#ba1c5c"],
      });
    }, 400);
  }, []);

  const popBalloon = useCallback((id: number, color: string, e: React.MouseEvent | React.TouchEvent) => {
    if (poppedBalloons[id]) return;

    setPoppedBalloons((prev) => ({
      ...prev,
      [id]: true,
    }));

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (clientX && clientY) {
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;

      safeConfetti({
        particleCount: 30,
        spread: 70,
        startVelocity: 24,
        origin: { x, y },
        colors: [color, "#FFD700", "#ffffff", "#ff2a85"],
        shapes: ["circle", "square"],
        scalar: 0.85,
        zIndex: 150,
      });
    }
  }, [poppedBalloons]);

  const handleLaunch = useCallback(() => {
    if (stage !== "idle") return;
    setStage("launching");

    setTimeout(() => {
      setStage("fireworks");
      triggerCelebrationConfetti();
      triggerPartyPoppers();
      startFireworkShow();
    }, 1200);
  }, [stage, startFireworkShow]);

  useEffect(() => {
    return () => {
      if (fireworkIntervalRef.current) {
        window.clearInterval(fireworkIntervalRef.current);
        fireworkIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden px-2 sm:px-6 py-6 sm:py-12">
      <div className="absolute w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] rounded-full bg-accent/5 blur-[90px] sm:blur-[120px] pointer-events-none z-0" />

      <AnimatePresence>
        {stage === "fireworks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,42,133,0.03)_15deg,transparent_30deg,rgba(255,42,133,0.03)_45deg,transparent_60deg)] rounded-full"
            />
            <div className="absolute top-1/4 left-1/4 w-40 sm:w-64 h-40 sm:h-64 bg-accent/10 rounded-full blur-[60px] sm:blur-[80px]" />
            <div className="absolute bottom-1/4 right-1/4 w-60 sm:w-96 h-60 sm:h-96 bg-white/5 rounded-full blur-[80px] sm:blur-[100px]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-7xl mx-auto flex items-center justify-between z-20 my-auto min-h-[80vh]">
        {/* LEFT DEDICATED BALLOON COLUMN */}
        {stage === "fireworks" && (
          <BalloonColumn
            slots={leftSlotData}
            poppedBalloons={poppedBalloons}
            onPopBalloon={popBalloon}
          />
        )}

        {/* CENTER PROTECTED HERO CONTENT COLUMN */}
        <div className="flex-1 flex flex-col items-center justify-center z-30 px-2 sm:px-6 max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            {(stage === "idle" || stage === "launching") && (
              <HeroLauncher stage={stage} onLaunch={handleLaunch} />
            )}

            {stage === "fireworks" && <FireworksStage />}
          </AnimatePresence>
        </div>

        {/* RIGHT DEDICATED BALLOON COLUMN */}
        {stage === "fireworks" && (
          <BalloonColumn
            slots={rightSlotData}
            poppedBalloons={poppedBalloons}
            onPopBalloon={popBalloon}
          />
        )}
      </div>

      <AnimatePresence>
        {stage === "fireworks" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="absolute bottom-2 sm:bottom-3 flex flex-col items-center gap-1 text-neutral-500 hover:text-accent transition-colors duration-300 z-50"
          >
            <span className="text-[8px] sm:text-[10px] font-mono tracking-widest uppercase bg-black/50 px-2 sm:px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Scroll to Discover
            </span>
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}