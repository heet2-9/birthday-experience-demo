"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type MicPermissionState = "idle" | "listening" | "denied" | "unsupported";

/**
 * Adjustable sensitivity constants for blow detection.
 * Fine-tune these values to adjust microphone detection behavior.
 */
export const DEFAULT_BLOW_CONFIG = {
  /** FFT size for Web Audio AnalyserNode from sherryuser/cake-blow */
  FFT_SIZE: 256,

  /** Average byte frequency threshold from sherryuser/cake-blow (average > 40) */
  FREQUENCY_AVERAGE_THRESHOLD: 40,

  /** Detection polling interval in milliseconds from sherryuser/cake-blow (setInterval 200ms) */
  POLLING_INTERVAL_MS: 200,
};

export interface BlowDetectionConfig {
  fftSize?: number;
  frequencyAverageThreshold?: number;
  pollingIntervalMs?: number;
}

interface UseBlowDetectionProps {
  onBlowDetected: () => void;
  enabled: boolean;
  config?: BlowDetectionConfig;
}

/**
 * Blow detection hook ported from reference repository:
 * https://github.com/sherryuser/cake-blow
 */
export function useBlowDetection({
  onBlowDetected,
  enabled,
  config: userConfig,
}: UseBlowDetectionProps) {
  const [micState, setMicState] = useState<MicPermissionState>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredStateRef = useRef<boolean>(false);
  const onBlowDetectedRef = useRef(onBlowDetected);

  useEffect(() => {
    onBlowDetectedRef.current = onBlowDetected;
  }, [onBlowDetected]);

  // Merge default config with user-provided config overrides
  const fftSize = userConfig?.fftSize ?? DEFAULT_BLOW_CONFIG.FFT_SIZE;
  const threshold =
    userConfig?.frequencyAverageThreshold ?? DEFAULT_BLOW_CONFIG.FREQUENCY_AVERAGE_THRESHOLD;
  const pollingIntervalMs =
    userConfig?.pollingIntervalMs ?? DEFAULT_BLOW_CONFIG.POLLING_INTERVAL_MS;

  const stopMic = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {}
      sourceNodeRef.current = null;
    }
    if (analyserNodeRef.current) {
      try {
        analyserNodeRef.current.disconnect();
      } catch {}
      analyserNodeRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
      audioCtxRef.current = null;
    }
    setMicState("idle");
  }, []);

  const enableMic = useCallback(async () => {
    if (hasTriggeredStateRef.current || !enabled) return;
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicState("unsupported");
      return;
    }

    try {
      // 1. Initialize AudioContext (window.AudioContext || window.webkitAudioContext)
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }

      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      if (streamRef.current) {
        setMicState("listening");
        return;
      }

      // 2. Request microphone stream (navigator.mediaDevices.getUserMedia({ audio: true }))
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = audioCtxRef.current;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // 3. Connect MediaStreamSource to AnalyserNode (analyser.fftSize = 256)
      const microphone = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize; // 256
      microphone.connect(analyser);

      sourceNodeRef.current = microphone;
      analyserNodeRef.current = analyser;
      setMicState("listening");

      // 4. Exact blow detection algorithm ported from sherryuser/cake-blow
      const isBlowing = () => {
        if (!analyserNodeRef.current) return false;
        const currentAnalyser = analyserNodeRef.current;
        const bufferLength = currentAnalyser.frequencyBinCount; // 128
        const dataArray = new Uint8Array(bufferLength);
        currentAnalyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        return average > threshold; // > 40
      };

      // 5. Polling check every 200ms (matching setInterval(blowOutCandles, 200))
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      intervalIdRef.current = setInterval(() => {
        if (hasTriggeredStateRef.current || !audioCtxRef.current) return;

        if (isBlowing() && !hasTriggeredStateRef.current) {
          hasTriggeredStateRef.current = true;
          stopMic();
          onBlowDetectedRef.current();
        }
      }, pollingIntervalMs);
    } catch (err) {
      console.log("Unable to access microphone: " + err);
      setMicState("denied");
    }
  }, [enabled, fftSize, threshold, pollingIntervalMs, stopMic]);

  useEffect(() => {
    if (!enabled) {
      stopMic();
    }
    return () => {
      stopMic();
    };
  }, [enabled, stopMic]);

  return {
    micState,
    enableMic,
    stopMic,
  };
}

