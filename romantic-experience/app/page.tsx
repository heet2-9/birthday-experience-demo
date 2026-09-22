"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

// Critical top-of-page components (Loaded synchronously for zero latency & instant LCP)
import LoadingScreen from "@/components/ui/LoadingScreen";
import CanvasParticles from "@/components/ui/CanvasParticles";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Hero from "@/components/Hero";

// Below-the-fold experience components
import LoveLetter from "@/components/LoveLetter";
import BouquetGenerator from "@/components/BouquetGenerator";
import MemoriesGallery from "@/components/MemoriesGallery";
import Timeline from "@/components/Timeline";
import FinalScene from "@/components/FinalScene";

function LazySection({ children }: { children: ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        minHeight: "75vh",
        contentVisibility: "auto",
        containIntrinsicSize: "100vh",
      }}
    >
      {shouldRender ? children : null}
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="bg-[#030303] min-h-screen text-white overflow-hidden relative">
      {/* 1. Loading Screen Stage Overlay */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* 2. Main Romantic Experience */}
      <CanvasParticles />

      <SmoothScroll>
        <Hero />

        <LazySection>
          <LoveLetter />
        </LazySection>

        <LazySection>
          <BouquetGenerator />
        </LazySection>

        <LazySection>
          <MemoriesGallery />
        </LazySection>

        <LazySection>
          <Timeline />
        </LazySection>

        <LazySection>
          <FinalScene />
        </LazySection>
      </SmoothScroll>
    </main>
  );
}
