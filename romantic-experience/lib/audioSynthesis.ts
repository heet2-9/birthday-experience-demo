"use client";

/**
 * Synthesizes a soft organic air "whoosh" sound natively using the Web Audio API.
 * Ensures zero external asset dependencies, zero network latency, and cross-browser reliability.
 */
export function playWhooshSound() {
  try {
    if (typeof window === "undefined") return;

    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const duration = 1.0;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate smooth white noise for airflow sound
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bandpass filter to create resonant wind sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    const now = audioCtx.currentTime;
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + duration);
    filter.Q.setValueAtTime(2.0, now);

    // Smooth volume envelope for whoosh effect
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);

    // Clean up AudioContext after sound finishes
    setTimeout(() => {
      if (audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }
    }, (duration + 0.2) * 1000);
  } catch (err) {
    console.debug("Whoosh sound playback error:", err);
  }
}

export function playTypewriterClickSound() {
  // Disabled typewriter audio synthesis
}
