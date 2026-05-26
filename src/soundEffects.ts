/**
 * Lightweight synthesized SFX via Web Audio API (no asset files).
 * AudioContext is created lazily on first play (browser autoplay policies).
 */

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (audioContext === null) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
};

const playTone = (
  frequency: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
): void => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
};

/** Soft click when a mark is placed. */
export const playMoveSound = (): void => {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  playTone(720, t, 0.06, 0.12);
  playTone(980, t + 0.02, 0.05, 0.06, "triangle");
};

/** Short ascending fanfare on win. */
export const playWinSound = (): void => {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    playTone(freq, t + i * 0.1, 0.22, 0.14);
  });
};

/** Gentle tick on draw. */
export const playDrawSound = (): void => {
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  playTone(440, t, 0.12, 0.1);
  playTone(330, t + 0.08, 0.14, 0.07);
};
