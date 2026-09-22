"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        const diff = Math.random() * 18 + 8;
        return Math.min(oldProgress + diff, 100);
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading birthday memories experience"
      className="fixed inset-0 bg-[#030303] z-[9999] flex flex-col items-center justify-center p-4"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="w-full max-w-xs space-y-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl tracking-widest text-white uppercase text-glow"
        >
          Loading memories...
        </motion.h1>

        <div className="relative h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-accent box-glow"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>

        <motion.p
          className="text-xs font-mono tracking-wider text-neutral-500 uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Wrapping your birthday surprise... {Math.floor(progress)}%
        </motion.p>
      </div>
    </motion.div>
  );
}
