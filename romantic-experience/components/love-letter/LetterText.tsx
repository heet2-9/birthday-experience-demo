"use client";

import React from "react";
import { motion } from "framer-motion";

interface LetterTextProps {
  stage: string;
}

export function LetterText({ stage }: LetterTextProps) {
  return (
    <div className="max-h-[58vh] overflow-y-auto pr-2 custom-scrollbar font-serif text-sm md:text-base leading-relaxed space-y-4 text-stone-800">
      <motion.div
        initial="hidden"
        animate={stage === "letterOpen" ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="space-y-4"
      >
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-xl font-medium text-stone-900 font-serif"
        >
          Dearest Emma ✨,
        </motion.p>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-2xl font-bold text-[#ff2a85] tracking-tight font-serif"
        >
          Happiest Birthday Ever 💕
        </motion.p>

        <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          Today isn&apos;t just another birthday. It&apos;s a celebration of the person you are and all the beautiful moments that make life feel so bright.
        </motion.p>

        <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          I hope this year brings you new adventures, unexpected joy, endless reasons to smile, and all the little things that matter most.
        </motion.p>

        <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          May your heart always be as full of happiness and light as you bring to everyone around you.
        </motion.p>

        <motion.p variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
          Here&apos;s to another wonderful chapter, another year, and countless unforgettable moments waiting to be created.
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="pt-4 border-t border-stone-200 flex flex-col items-end"
        >
          <p className="font-semibold text-stone-900">Forever and always.. 💖</p>
          <p className="italic font-medium text-[#ff2a85] mt-1 font-sans tracking-wide">— With all my love ❤️</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
