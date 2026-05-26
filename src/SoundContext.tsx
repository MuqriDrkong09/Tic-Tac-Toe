import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  playDrawSound,
  playMoveSound,
  playWinSound,
} from "./soundEffects.ts";
import {
  getInitialSoundEnabled,
  persistSoundEnabled,
} from "./soundSettings.ts";

type SoundContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playMove: () => void;
  playWin: () => void;
  playDraw: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export type SoundProviderProps = {
  children: ReactNode;
};

export function SoundProvider({ children }: SoundProviderProps) {
  const [soundEnabled, setSoundEnabledState] = useState(getInitialSoundEnabled);

  useEffect(() => {
    persistSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => !prev);
  }, []);

  const playIfEnabled = useCallback(
    (play: () => void) => {
      if (soundEnabled) play();
    },
    [soundEnabled],
  );

  const playMove = useCallback(
    () => playIfEnabled(playMoveSound),
    [playIfEnabled],
  );
  const playWin = useCallback(
    () => playIfEnabled(playWinSound),
    [playIfEnabled],
  );
  const playDraw = useCallback(
    () => playIfEnabled(playDrawSound),
    [playIfEnabled],
  );

  const value = useMemo(
    () => ({
      soundEnabled,
      setSoundEnabled,
      toggleSound,
      playMove,
      playWin,
      playDraw,
    }),
    [soundEnabled, setSoundEnabled, toggleSound, playMove, playWin, playDraw],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export const useSound = (): SoundContextValue => {
  const ctx = useContext(SoundContext);
  if (ctx === null) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return ctx;
};
