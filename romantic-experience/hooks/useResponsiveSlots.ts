import { useState, useEffect } from "react";

export function useResponsiveSlots(): number {
  const [slotCountPerSide, setSlotCountPerSide] = useState<number>(4);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const tabletQuery = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");

    const updateSlots = () => {
      if (mobileQuery.matches) {
        setSlotCountPerSide(2);
      } else if (tabletQuery.matches) {
        setSlotCountPerSide(3);
      } else {
        setSlotCountPerSide(4);
      }
    };

    updateSlots();

    mobileQuery.addEventListener("change", updateSlots);
    tabletQuery.addEventListener("change", updateSlots);

    return () => {
      mobileQuery.removeEventListener("change", updateSlots);
      tabletQuery.removeEventListener("change", updateSlots);
    };
  }, []);

  return slotCountPerSide;
}
