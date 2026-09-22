"use client";

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BalloonSlotData } from "@/types";

interface BalloonItemProps {
  data: BalloonSlotData;
  isPopped: boolean;
  onPop: (e: React.MouseEvent | React.TouchEvent) => void;
}

function BalloonItemComponent({ data, isPopped, onPop }: BalloonItemProps) {
  const handlePop = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onPop(e);
  };

  return (
    <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center relative select-none">
      {/* 1. Unpopped Floating Balloon */}
      <AnimatePresence>
        {!isPopped && (
          <motion.div
            key={`balloon-${data.id}`}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ scale: [1, 1.3, 0], opacity: [1, 1, 0] }}
            transition={{
              y: { duration: 2.2, delay: data.delay, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 1, delay: data.delay },
              exit: { duration: 0.15, ease: "easeOut" },
            }}
            className="absolute flex flex-col items-center cursor-pointer pointer-events-auto z-10 touch-manipulation"
            onClick={handlePop}
            onTouchEnd={handlePop}
          >
            {/* Idle floating motion inside fixed slot */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{
                duration: 3 + (data.id % 3) * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 1.22 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-10 h-14 sm:w-13 sm:h-18 relative shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.18),0_10px_20px_rgba(0,0,0,0.35)] hover:brightness-125 transition-all"
                style={{
                  backgroundColor: data.color,
                  borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                }}
              >
                <div className="absolute top-1.5 left-1.5 w-2.5 sm:w-3.5 h-3 sm:h-5 bg-white/40 rounded-full blur-[2px] rotate-45" />
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-t-[6px] border-l-[4px] border-r-[4px] border-transparent"
                  style={{ borderTopColor: data.color }}
                />
              </div>
              <div className="w-[1.5px] h-10 sm:h-14 bg-white/25 -mt-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Revealed Nickname Badge */}
      <AnimatePresence>
        {isPopped && (
          <motion.div
            key={`nickname-${data.id}`}
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: 1, scale: [0.4, 1.08, 1], y: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="absolute px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full bg-black/90 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,42,133,0.6)] whitespace-nowrap text-center pointer-events-none z-20"
          >
            <span
              className="font-serif text-[11px] sm:text-xs md:text-sm font-semibold tracking-wide"
              style={{
                color: data.color === "#ffffff" ? "#FFD700" : data.color,
              }}
            >
              {data.nickname}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const BalloonItem = memo(BalloonItemComponent);
