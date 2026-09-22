"use client";

import React, { memo, useMemo } from "react";
import { ROMANTIC_EMOJIS } from "@/data/story";

const ROSE_PETAL_PATH = "M12 2C8 2 4 5 4 10c0 5 4 8 8 10 4-2 8-5 8-10 0-5-4-8-8-8z";
const SUNFLOWER_PETAL_PATH = "M12 2c-2.5 0-4.5 4-4.5 9s2 9 4.5 11c2.5-2 4.5-6 4.5-11s-2-9-4.5-9z";

function DriftingPetalsComponent() {
  const floatingEmojis = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      emoji: ROMANTIC_EMOJIS[i % ROMANTIC_EMOJIS.length],
      left: `${4 + i * 6}%`,
      size: `${1.1 + (i % 3) * 0.4}rem`,
      duration: 6 + (i % 4) * 2.2,
      delay: (i % 5) * 0.7,
      drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 12),
      rotation: (i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 10),
    }));
  }, []);

  const rosePetals = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: `${6 + i * 9.5}%`,
      scale: 0.6 + (i % 3) * 0.25,
      duration: 8 + (i % 3) * 2.5,
      delay: (i % 4) * 0.8,
      sway: (i % 2 === 0 ? 1 : -1) * (30 + (i % 3) * 15),
      rotate: (i % 2 === 0 ? 1 : -1) * (120 + (i % 3) * 60),
      isSunflowerPetal: i % 2 === 0,
    }));
  }, []);

  const twinklingStars = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 17) % 96}%`,
      top: `${(i * 23) % 92}%`,
      size: `${2 + (i % 3) * 2}px`,
      duration: 2 + (i % 4) * 0.8,
      delay: (i % 6) * 0.4,
    }));
  }, []);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {twinklingStars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              "--duration": `${star.duration}s`,
              "--delay": `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {rosePetals.map((petal) => (
          <div
            key={`petal-${petal.id}`}
            className={`absolute animate-fall-down ${petal.isSunflowerPetal
                ? "text-[#FFD700]/80 drop-shadow-[0_4px_10px_rgba(255,215,0,0.4)]"
                : "text-rose-500/80 drop-shadow-[0_4px_10px_rgba(255,42,133,0.3)]"
              }`}
            style={{
              left: petal.left,
              transform: `scale(${petal.scale})`,
              "--duration": `${petal.duration}s`,
              "--delay": `${petal.delay}s`,
              "--sway": `${petal.sway}px`,
              "--rot": `${petal.rotate}deg`,
            } as React.CSSProperties}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d={petal.isSunflowerPetal ? SUNFLOWER_PETAL_PATH : ROSE_PETAL_PATH} />
            </svg>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={`emoji-${item.id}`}
            className="absolute drop-shadow-lg filter animate-float-up"
            style={{
              left: item.left,
              fontSize: item.size,
              "--duration": `${item.duration}s`,
              "--delay": `${item.delay}s`,
              "--drift": `${item.drift}px`,
              "--rot": `${item.rotation}deg`,
            } as React.CSSProperties}
          >
            {item.emoji}
          </div>
        ))}
      </div>
    </>
  );
}

export const DriftingPetals = memo(DriftingPetalsComponent);
