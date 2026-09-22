import { useState, useEffect } from "react";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        animationFrameId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return mousePosition;
}