/**
 * Core domain types for the Tic-Tac-Toe game.
 *
 * `BoardState` is a flat array of length `size × size`.
 * `WinningLine` holds the indices of the consecutive cells that won.
 */

export type Player = "X" | "O";

export type GameMode = "pvp" | "vs_ai";

export type AiDifficulty = "easy" | "medium" | "hard";

export type BoardSize = 3 | 4 | 5;

export type PlayerNames = {
  readonly X: string;
  readonly O: string;
};

/** Options chosen on the pre-game screen; fixed for the current match. */
export type GameConfig = {
  readonly gameMode: GameMode;
  readonly aiDifficulty: AiDifficulty;
  readonly boardSize: BoardSize;
  /** Local human side in vs_ai mode (ignored in pvp). */
  readonly humanPlayer: Player;
  readonly names: PlayerNames;
};

export const getAiPlayer = (config: GameConfig): Player =>
  config.humanPlayer === "X" ? "O" : "X";

export const getPlayerName = (config: GameConfig, player: Player): string =>
  config.names[player];

export type Cell = Player | null;

/** Flat board: index = row × size + col */
export type BoardState = readonly Cell[];

export type CellIndex = number;

/** Indices of the cells that form the winning run (length = winLength). */
export type WinningLine = readonly number[];

/** A single move recorded when transitioning between board snapshots. */
export type Move = {
  readonly player: Player;
  readonly cellIndex: CellIndex;
};

export type GameStatus =
  | { kind: "in_progress"; nextPlayer: Player }
  | { kind: "won"; winner: Player; line: WinningLine }
  | { kind: "draw" };

export type Scoreboard = {
  readonly X: number;
  readonly O: number;
  readonly draws: number;
};
