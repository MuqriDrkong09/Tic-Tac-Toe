import { useState } from "react";
import type { GameConfig, Scoreboard as ScoreboardType } from "../types.ts";
import GameSession from "./GameSession.tsx";
import PreGameSetup from "./PreGameSetup.tsx";

const INITIAL_SCORE: ScoreboardType = { X: 0, O: 0, draws: 0 };

type Phase = "setup" | "playing";

/**
 * Orchestrates pre-game setup and the active match.
 * Score persists when returning to setup so a session can span multiple games.
 */
export default function Game() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [score, setScore] = useState<ScoreboardType>(INITIAL_SCORE);

  if (phase === "setup") {
    return (
      <PreGameSetup
        initialConfig={config}
        onStart={(nextConfig) => {
          setConfig(nextConfig);
          setPhase("playing");
        }}
      />
    );
  }

  return (
    <GameSession
      config={config!}
      score={score}
      onScoreChange={setScore}
      onBackToSetup={() => setPhase("setup")}
    />
  );
}
