"use client";

import { useEffect } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On mobile touch devices, native momentum scrolling is smoother and consumes less battery.
    // Skip loading Lenis completely on mobile so mobile bundle size stays minimal.
    const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    if (isTouchDevice) return;

    let lenisInstance: any = null;
    let rafId: number;

    import("@studio-freight/lenis").then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });

      function raf(time: number) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      }

      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return <>{children}</>;
}
