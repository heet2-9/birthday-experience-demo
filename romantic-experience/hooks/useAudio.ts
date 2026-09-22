"use client";

import { useContext } from "react";
import { AudioContext, AudioContextType } from "@/context/AudioContext";

export type UseAudioReturn = AudioContextType;

export function useAudio(_src?: string): UseAudioReturn {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
