"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { MemoryStage, MemoryItem } from "@/types";
import { MEMORIES } from "@/data/memories";
import { PolaroidCard } from "./memories/PolaroidCard";
import { PhotoLightbox } from "./memories/PhotoLightbox";
import { CameraViewfinder } from "./memories/CameraViewfinder";

export default function MemoriesGallery() {
  const [stage, setStage] = useState<MemoryStage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFlashing, setIsFlashing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    setMousePos({ x, y });
  }, []);

  const handleShutter = useCallback(() => {
    if (stage !== "intro" && stage !== "viewing") return;

    setIsFlashing(true);
    setStage("developing");

    setTimeout(() => {
      setIsFlashing(false);
      setTimeout(() => {
        setTimeout(() => {
          if (currentIndex === MEMORIES.length - 1) {
            setStage("collage");
          } else {
            setStage("viewing");
          }
        }, 2500);
      }, 800);
    }, 150);
  }, [stage, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    setStage("intro");
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={stage === "collage" ? undefined : handleMouseMove}
      className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#030303] overflow-hidden py-12 sm:py-16 md:py-24 px-3 sm:px-6"
    >
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#ff2a85]/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage !== "collage" && (
          <motion.div
            key="camera-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="relative flex flex-col items-center justify-center w-full max-w-4xl min-h-[70vh] sm:min-h-[75vh] md:min-h-[85vh] z-10 px-2 sm:px-4 perspective-[1000px]"
          >
            <div className="h-16 sm:h-20 flex flex-col items-center justify-center mb-4 md:mb-8 text-center px-2">
              <AnimatePresence mode="wait">
                {stage === "intro" && (
                  <motion.div
                    key="intro-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-1.5 sm:space-y-3"
                  >
                    <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-white tracking-tight">
                      Three moments, one special story, and a thousand reasons to celebrate{" "}
                      <span className="italic text-[#ff2a85] drop-shadow-[0_0_15px_rgba(255,42,133,0.5)]">
                        Emma
                      </span>
                      .
                    </h2>
                    <p className="font-mono text-[9px] sm:text-xs text-neutral-400 uppercase tracking-widest">
                      Press the red shutter to reveal a precious memory
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative flex flex-col items-center justify-center w-full my-auto pb-12 sm:pb-24 md:pb-32">
              <CameraViewfinder
                stage={stage}
                mousePos={mousePos}
                isFlashing={isFlashing}
                onShutter={handleShutter}
              />

              <AnimatePresence>
                {(stage === "developing" || stage === "viewing") && (
                  <motion.div
                    initial={{ y: -140, opacity: 0, zIndex: 10 }}
                    animate={{ y: 55, opacity: 1, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.5 }}
                    className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 sm:-bottom-20"
                  >
                    <PolaroidCard
                      memory={MEMORIES[currentIndex]}
                      isDeveloping={stage === "developing"}
                      onClick={() => setSelectedPhoto(MEMORIES[currentIndex])}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-14 sm:h-16 flex items-center justify-center mt-16 sm:mt-24 md:mt-28 z-30">
              <AnimatePresence>
                {stage === "viewing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <button
                      onClick={handleNext}
                      aria-label="Develop Next Memory"
                      className="px-5 py-2 sm:px-8 sm:py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#ff2a85]/20 hover:border-[#ff2a85]/50 hover:text-[#ff2a85] transition-all duration-300 backdrop-blur-md shadow-lg"
                    >
                      Develop Next Memory
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "collage" && (
          <motion.div
            key="collage-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-full max-w-6xl mx-auto flex flex-col items-center z-20 px-2 sm:px-4"
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12 relative mb-16 sm:mb-24 md:mb-32">
              {MEMORIES.map((memory, idx) => {
                const rotation = idx % 2 === 0 ? idx * 3 - 6 : idx * -4 + 5;
                const yOffset = idx % 2 === 0 ? 10 : -10;

                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 80, rotate: 0 }}
                    animate={{ opacity: 1, y: yOffset, rotate: rotation }}
                    transition={{ type: "spring", stiffness: 40, damping: 12, delay: idx * 0.2 }}
                  >
                    <PolaroidCard
                      memory={memory}
                      isDeveloping={false}
                      onClick={() => setSelectedPhoto(memory)}
                    />
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: MEMORIES.length * 0.3 + 1 }}
              className="text-center space-y-4 sm:space-y-6 px-2"
            >
              <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl text-neutral-300 tracking-tight leading-relaxed">
                Three different pictures... <br />
                <span className="italic text-white">Same beautiful soul🫶💗.</span>
              </h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex justify-center"
              >
                <Heart
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff2a85] fill-[#ff2a85]"
                  style={{ filter: "drop-shadow(0 0 10px rgba(255,42,133,0.8))" }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoLightbox memory={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}