import confetti from "canvas-confetti";

export function safeConfetti(options: confetti.Options) {
  try {
    confetti(options);
  } catch (err) {
    console.debug("Confetti execution error:", err);
  }
}

export function triggerPartyPoppers() {
  const popperColors = ["#ff2a85", "#ffffff", "#FFD700"];
  safeConfetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0, y: 1 },
    angle: 60,
    colors: popperColors,
    startVelocity: 45,
    zIndex: 100,
  });
  safeConfetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 1, y: 1 },
    angle: 120,
    colors: popperColors,
    startVelocity: 45,
    zIndex: 100,
  });
}

export function triggerCelebrationConfetti() {
  const duration = 2500;
  const animationEnd = Date.now() + duration;
  const themeColors = ["#ff2a85", "#FFD700", "#ffffff", "#f5efe2", "#ff73b3"];

  safeConfetti({
    particleCount: 60,
    spread: 100,
    origin: { y: 0.35, x: 0.5 },
    colors: themeColors,
    shapes: ["star", "square", "circle"],
    scalar: 1.2,
    ticks: 200,
    startVelocity: 35,
    zIndex: 120,
  });

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 25 * (timeLeft / duration);
    safeConfetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.4 },
      colors: themeColors,
      shapes: ["square", "circle"],
      startVelocity: 45,
      zIndex: 120,
    });
    safeConfetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.4 },
      colors: themeColors,
      shapes: ["square", "circle"],
      startVelocity: 45,
      zIndex: 120,
    });
  }, 250);
}
