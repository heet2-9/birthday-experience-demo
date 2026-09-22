"use client";

import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MemoryItem } from "@/types";

interface PolaroidCardProps {
  memory: MemoryItem;
  isDeveloping: boolean;
  onClick?: () => void;
}

function PolaroidCardComponent({ memory, isDeveloping, onClick }: PolaroidCardProps) {
  return (
    <motion.div
      whileHover={!isDeveloping ? { scale: 1.05, rotate: 0, y: -10, zIndex: 50 } : {}}
      onClick={!isDeveloping ? onClick : undefined}
      className={`relative w-[190px] xs:w-[220px] sm:w-[250px] md:w-[280px] p-2.5 sm:p-4 bg-[#faf6ee] shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-[#eaddca]/40 group ${
        !isDeveloping ? "cursor-pointer" : ""
      }`}
    >
      <div className="w-full aspect-square bg-stone-900 relative overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] mb-8 sm:mb-14">
        {/* Memory Photo Image */}
        <motion.div
          animate={{
            filter: isDeveloping
              ? [
                  "brightness(1.4) sepia(0.6) contrast(0.9)",
                  "brightness(1.2) sepia(0.3) contrast(0.95)",
                  "brightness(1) sepia(0) contrast(1)",
                ]
              : "brightness(1) sepia(0) contrast(1)",
            opacity: isDeveloping ? [0.6, 0.85, 1] : 1,
          }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          className="w-full h-full relative"
        >
          <Image
            src={memory.src}
            alt={memory.title}
            fill
            sizes="(max-width: 640px) 220px, (max-width: 768px) 250px, 280px"
            quality={90}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-4 right-2 sm:right-4 flex flex-col items-center text-center">
        <h3 className="font-serif text-sm sm:text-lg font-bold text-stone-800 opacity-90 tracking-tight leading-snug">
          {memory.title}
        </h3>
        <p className="font-serif italic text-[9px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">
          {memory.caption}
        </p>
      </div>

      <div className="absolute top-1.5 right-2 font-mono text-[8px] sm:text-[10px] text-stone-400 opacity-60 uppercase tracking-widest">
        {memory.date}
      </div>
    </motion.div>
  );
}

export const PolaroidCard = memo(PolaroidCardComponent);
