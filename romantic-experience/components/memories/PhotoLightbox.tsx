"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MemoryItem } from "@/types";

interface PhotoLightboxProps {
  memory: MemoryItem;
  onClose: () => void;
}

export function PhotoLightbox({ memory, onClose }: PhotoLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 select-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close photo preview"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors p-2 z-[10000] cursor-pointer bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md shadow-lg"
      >
        <X className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative max-w-[92vw] sm:max-w-[85vw] md:max-w-[75vw] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[90vw] sm:w-[80vw] md:w-[70vw] h-[65vh] sm:h-[75vh] md:h-[80vh] flex items-center justify-center">
          <Image
            src={memory.src}
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 70vw"
            quality={90}
            priority
            className="object-contain rounded-md shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(255,42,133,0.25)]"
          />
        </div>

        <div className="mt-3 sm:mt-4 text-center space-y-1 px-2">
          <h3 className="font-serif text-base sm:text-xl text-white font-semibold tracking-tight">
            {memory.title}
          </h3>
          <p className="font-serif italic text-xs sm:text-sm text-amber-200/90">
            {memory.caption}
          </p>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
