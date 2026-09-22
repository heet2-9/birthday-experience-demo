"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type MicPermissionState = "idle" | "listening" | "denied" | "unsupported";

/**
 * Adjustable sensitivity constants for blow detection.
 * Fine-tune these values to adjust microphone detection behavior.
 */
export const DEFAULT_BLOW_CONFIG = {
  /** FFT size for Web Audio AnalyserNode. 2048 provides ~21.5 Hz bin resolution at 44.1 kHz */
  FFT_SIZE: 2048,

  /** Lower bound of wind/rumble frequency band in Hz */
  LOW_FREQ_MIN_HZ: 20,

  /** Upper bound of wind/rumble frequency band in Hz (expanded to 1200 Hz for real-world turbulent air) */
  LOW_FREQ_MAX_HZ: 1200,

  /** Required minimum percentage of total spectral energy in wind band (0.35 = 35%) */
  LOW_FREQ_RATIO_THRESHOLD: 0.35,

  /** Base RMS threshold required to trigger blow detection */
  BLOW_RMS_THRESHOLD: 0.018,

  /** Duration (ms) to sample ambient room noise on microphone activation */
  CALIBRATION_DURATION_MS: 400,

  /** Multiplier for dynamic ambient noise floor adjustment */
  NOISE_FLOOR_MULTIPLIER: 1.8,

  /** Safety margin added above the ambient noise floor */
  NOISE_FLOOR_MARGIN: 0.01,

  /** Continuous duration (ms) blowing condition must be active to filter short impulses */
  SUSTAINED_DURATION_MS: 150,

  /** AnalyserNode smoothing time constant */
  SMOOTHING_TIME_CONSTANT: 0.2,
};

export interface BlowDetectionConfig {
  fftSize?: number;
  lowFreqMinHz?: number;
  lowFreqMaxHz?: number;
  lowFreqRatioThreshold?: number;
  baseRmsThreshold?: number;
  calibrationDurationMs?: number;
  noiseFloorMultiplier?: number;
  noiseFloorMargin?: number;
  sustainedDurationMs?: number;
  smoothingTimeConstant?: number;
}

interface UseBlowDetectionProps {
  onBlowDetected: () => void;
  enabled: boolean;
  config?: BlowDetectionConfig;
  /** Deprecated legacy threshold props preserved for backwards compatibility */
  energyThreshold?: number;
  windThreshold?: number;
}

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
  const animFrameIdRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);
  const onBlowDetectedRef = useRef(onBlowDetected);

  useEffect(() => {
    onBlowDetectedRef.current = onBlowDetected;
  }, [onBlowDetected]);

  // Merge default config with user-provided config overrides
  const fftSize = userConfig?.fftSize ?? DEFAULT_BLOW_CONFIG.FFT_SIZE;
  const lowFreqMinHz = userConfig?.lowFreqMinHz ?? DEFAULT_BLOW_CONFIG.LOW_FREQ_MIN_HZ;
  const lowFreqMaxHz = userConfig?.lowFreqMaxHz ?? DEFAULT_BLOW_CONFIG.LOW_FREQ_MAX_HZ;
  const lowFreqRatioThreshold =
    userConfig?.lowFreqRatioThreshold ?? DEFAULT_BLOW_CONFIG.LOW_FREQ_RATIO_THRESHOLD;
  const baseRmsThreshold = userConfig?.baseRmsThreshold ?? DEFAULT_BLOW_CONFIG.BLOW_RMS_THRESHOLD;
  const calibrationDurationMs =
    userConfig?.calibrationDurationMs ?? DEFAULT_BLOW_CONFIG.CALIBRATION_DURATION_MS;
  const noiseFloorMultiplier =
    userConfig?.noiseFloorMultiplier ?? DEFAULT_BLOW_CONFIG.NOISE_FLOOR_MULTIPLIER;
  const noiseFloorMargin =
    userConfig?.noiseFloorMargin ?? DEFAULT_BLOW_CONFIG.NOISE_FLOOR_MARGIN;
  const sustainedDurationMs =
    userConfig?.sustainedDurationMs ?? DEFAULT_BLOW_CONFIG.SUSTAINED_DURATION_MS;
  const smoothingTimeConstant =
    userConfig?.smoothingTimeConstant ?? DEFAULT_BLOW_CONFIG.SMOOTHING_TIME_CONSTANT;

  const stopMic = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
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
    if (hasTriggeredRef.current || !enabled) return;
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicState("unsupported");
      return;
    }

    try {
      // 1. Initialize or resume AudioContext
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

      // 2. Request audio stream with broad cross-browser compatibility
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      streamRef.current = stream;
      const audioContext = audioCtxRef.current;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // 3. Connect MediaStreamSource to AnalyserNode with configured fftSize
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      source.connect(analyser);

      sourceNodeRef.current = source;
      analyserNodeRef.current = analyser;

      const timeDomainData = new Float32Array(analyser.fftSize);
      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      setMicState("listening");

      // 4. Calibration & blow detection tracking state
      const calibrationStartTime = performance.now();
      const ambientSamples: number[] = [];
      let dynamicRmsThreshold = baseRmsThreshold;
      let ambientNoiseFloor = 0;
      let isCalibrated = false;
      let blowStartTime: number | null = null;

      // 5. Real-time multi-criteria blow detection loop
      const detectBlow = () => {
        if (hasTriggeredRef.current || !audioCtxRef.current) return;

        // A) Time-domain RMS Volume Calculation
        analyser.getFloatTimeDomainData(timeDomainData);
        let sumSquares = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          const sample = timeDomainData[i];
          sumSquares += sample * sample;
        }
        const currentRms = Math.sqrt(sumSquares / timeDomainData.length);

        const now = performance.now();

        // B) Initial Ambient Noise Floor Calibration (~400ms baseline sampling)
        if (!isCalibrated) {
          ambientSamples.push(currentRms);
          if (now - calibrationStartTime >= calibrationDurationMs) {
            ambientNoiseFloor =
              ambientSamples.reduce((acc, v) => acc + v, 0) / (ambientSamples.length || 1);
            dynamicRmsThreshold = Math.max(
              baseRmsThreshold,
              ambientNoiseFloor * noiseFloorMultiplier + noiseFloorMargin
            );
            isCalibrated = true;
          }
        }

        // C) Spectral & Frequency Analysis (Low-to-mid frequency wind 20–1200 Hz)
        analyser.getByteFrequencyData(frequencyData);
        const sampleRate = audioContext.sampleRate;
        const binWidth = sampleRate / analyser.fftSize;

        let lowFreqEnergy = 0;
        let totalFreqEnergy = 0;

        for (let i = 0; i < frequencyData.length; i++) {
          const freq = i * binWidth;
          const norm = frequencyData[i] / 255;
          const power = norm * norm;
          totalFreqEnergy += power;

          if (freq >= lowFreqMinHz && freq <= lowFreqMaxHz) {
            lowFreqEnergy += power;
          }
        }

        const lowFreqRatio = totalFreqEnergy > 0.00001 ? lowFreqEnergy / totalFreqEnergy : 0;

        // D) Multi-Criteria Evaluation:
        // 1. RMS above dynamic noise floor OR relative spike (2.8x ambient noise floor)
        // 2. Wind turbulence frequency energy ratio >= 35% OR high amplitude airflow (>0.05 RMS)
        const isRmsElevated =
          currentRms >= dynamicRmsThreshold ||
          (isCalibrated && ambientNoiseFloor > 0 && currentRms >= ambientNoiseFloor * 2.8 && currentRms >= 0.012);

        const isBlowingFrame =
          isRmsElevated && (lowFreqRatio >= lowFreqRatioThreshold || currentRms >= 0.05);

        // E) Sustained Blow Duration Filter (Requires 150ms continuous blow, ignoring <50ms clicks)
        if (isBlowingFrame) {
          if (blowStartTime === null) {
            blowStartTime = now;
          }
          const elapsedDuration = now - blowStartTime;

          if (elapsedDuration >= sustainedDurationMs && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            stopMic();
            onBlowDetectedRef.current();
            return;
          }
        } else {
          blowStartTime = null;
        }

        animFrameIdRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch (err) {
      console.warn("Microphone access error:", err);
      setMicState("denied");
    }
  }, [
    enabled,
    fftSize,
    lowFreqMinHz,
    lowFreqMaxHz,
    lowFreqRatioThreshold,
    baseRmsThreshold,
    calibrationDurationMs,
    noiseFloorMultiplier,
    noiseFloorMargin,
    sustainedDurationMs,
    smoothingTimeConstant,
    stopMic,
  ]);

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

