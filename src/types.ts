/**
 * Core domain types for the Tic-Tac-Toe game.
 *
 * Design notes:
 * - `BoardState` is a fixed-length 9-tuple, so any out-of-bounds access is
 *   a compile-time error and helpers can rely on exact length.
 * - `GameStatus` is a discriminated union (`kind`) so consumers can use
 *   exhaustive `switch` statements and get full type-narrowing.
 */

export type Player = "X" | "O";

export type GameMode = "pvp" | "vs_ai";

export type AiDifficulty = "easy" | "medium" | "hard";

export type Cell = Player | null;

export type BoardState = readonly [
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
  Cell,
];

export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** A single move recorded when transitioning between board snapshots. */
export type Move = {
  readonly player: Player;
  readonly cellIndex: CellIndex;
};

export type WinningLine = readonly [CellIndex, CellIndex, CellIndex];

export type GameStatus =
  | { kind: "in_progress"; nextPlayer: Player }
  | { kind: "won"; winner: Player; line: WinningLine }
  | { kind: "draw" };

export type Scoreboard = {
  readonly X: number;
  readonly O: number;
  readonly draws: number;
};

export const EMPTY_BOARD: BoardState = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
] as const;

export const WINNING_LINES: readonly WinningLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;
