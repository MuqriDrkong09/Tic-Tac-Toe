import confetti from "canvas-confetti";

const BRAND_COLORS = ["#1976d2", "#e91e63", "#2e7d32", "#ffffff"] as const;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/**
 * Short celebratory burst on win. No-op when reduced motion is preferred.
 */
export const fireWinConfetti = (): void => {
  if (prefersReducedMotion()) return;

  confetti({
    particleCount: 90,
    spread: 72,
    startVelocity: 38,
    origin: { y: 0.55 },
    colors: [...BRAND_COLORS],
    disableForReducedMotion: true,
  });

  const end = Date.now() + 800;
  const tick = (): void => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: [...BRAND_COLORS],
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: [...BRAND_COLORS],
      disableForReducedMotion: true,
    });
    if (Date.now() < end) {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
};
