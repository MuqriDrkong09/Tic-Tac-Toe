export const SOUND_ENABLED_STORAGE_KEY = "tic-tac-toe-sound-enabled";

/** Default off when the user prefers reduced motion (accessibility). */
export const getInitialSoundEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // ignore storage access errors
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return false;
  }
  return true;
};

export const persistSoundEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(enabled));
  } catch {
    // ignore storage access errors
  }
};
