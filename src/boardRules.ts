import type { BoardSize, BoardState } from "./types.ts";

export type BoardRules = {
  readonly size: BoardSize;
  /** Number of marks in a row required to win (N-in-a-row on an N×N board). */
  readonly winLength: number;
};

export const createBoardRules = (size: BoardSize): BoardRules => ({
  size,
  winLength: size,
});

export const createEmptyBoard = (size: BoardSize): BoardState =>
  Array.from({ length: size * size }, () => null) as BoardState;

/** Responsive cell pixel sizes per board dimension. */
export const getCellDimensions = (
  size: BoardSize,
  isSmUp: boolean,
): { cell: number; gap: number; padding: number } => {
  const table: Record<BoardSize, { sm: number; xs: number }> = {
    3: { sm: 96, xs: 80 },
    4: { sm: 72, xs: 60 },
    5: { sm: 56, xs: 48 },
  };
  const cell = isSmUp ? table[size].sm : table[size].xs;
  const gap = size === 3 ? (isSmUp ? 12 : 8) : size === 4 ? 8 : 6;
  const padding = size === 3 ? (isSmUp ? 12 : 8) : size === 4 ? 10 : 8;
  return { cell, gap, padding };
};

export const indexToRowCol = (
  index: number,
  size: number,
): { row: number; col: number } => ({
  row: Math.floor(index / size),
  col: index % size,
});

export const rowColToIndex = (row: number, col: number, size: number): number =>
  row * size + col;
