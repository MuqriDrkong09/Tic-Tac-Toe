import type { BoardRules } from "./boardRules.ts";
import type {
  BoardState,
  Cell,
  CellIndex,
  GameStatus,
  Move,
  Player,
  WinningLine,
} from "./types.ts";

/**
 * Pure game-logic utilities for Tic-Tac-Toe variants.
 * All functions accept `rules` so win detection works for any board size.
 */

export const getNextPlayer = (board: BoardState): Player => {
  let xCount = 0;
  let oCount = 0;
  for (const cell of board) {
    if (cell === "X") xCount++;
    else if (cell === "O") oCount++;
  }
  return xCount <= oCount ? "X" : "O";
};

const tryLine = (
  board: BoardState,
  rules: BoardRules,
  startRow: number,
  startCol: number,
  dRow: number,
  dCol: number,
): { winner: Player; line: WinningLine } | null => {
  const { size, winLength } = rules;
  const indices: number[] = [];

  for (let i = 0; i < winLength; i++) {
    const row = startRow + dRow * i;
    const col = startCol + dCol * i;
    if (row < 0 || row >= size || col < 0 || col >= size) return null;
    indices.push(row * size + col);
  }

  const first = board[indices[0]!];
  if (first === null) return null;
  if (indices.every((idx) => board[idx] === first)) {
    return { winner: first, line: indices };
  }
  return null;
};

/**
 * Scans rows, columns, and diagonals for `winLength` consecutive marks.
 */
export const calculateWinner = (
  board: BoardState,
  rules: BoardRules,
): { winner: Player; line: WinningLine } | null => {
  const { size } = rules;
  const directions = [
    { dRow: 0, dCol: 1 },
    { dRow: 1, dCol: 0 },
    { dRow: 1, dCol: 1 },
    { dRow: 1, dCol: -1 },
  ] as const;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      for (const { dRow, dCol } of directions) {
        const result = tryLine(board, rules, row, col, dRow, dCol);
        if (result !== null) return result;
      }
    }
  }
  return null;
};

export const isBoardFull = (board: BoardState): boolean =>
  board.every((cell) => cell !== null);

export const getGameStatus = (
  board: BoardState,
  rules: BoardRules,
): GameStatus => {
  const winInfo = calculateWinner(board, rules);
  if (winInfo !== null) {
    return { kind: "won", winner: winInfo.winner, line: winInfo.line };
  }
  if (isBoardFull(board)) {
    return { kind: "draw" };
  }
  return { kind: "in_progress", nextPlayer: getNextPlayer(board) };
};

export const applyMove = (
  board: BoardState,
  index: CellIndex,
  player: Player,
): BoardState => {
  if (index < 0 || index >= board.length || board[index] !== null) {
    return board;
  }
  const next = [...board] as Cell[];
  next[index] = player;
  return next;
};

export const getMoveAtStep = (
  history: readonly BoardState[],
  step: number,
): Move | null => {
  if (step <= 0 || step >= history.length) return null;
  const prev = history[step - 1]!;
  const next = history[step]!;
  for (let i = 0; i < next.length; i++) {
    if (prev[i] === null && next[i] !== null) {
      return { player: next[i] as Player, cellIndex: i };
    }
  }
  return null;
};

/** Human-friendly cell label (1 … size×size, top-left to bottom-right). */
export const formatCellPosition = (index: CellIndex): number => index + 1;
