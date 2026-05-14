import {
  WINNING_LINES,
  type BoardState,
  type Cell,
  type CellIndex,
  type GameStatus,
  type Player,
  type WinningLine,
} from "./types.ts";

/**
 * Pure game-logic utilities for Tic-Tac-Toe.
 *
 * All functions are side-effect free and never mutate their inputs,
 * so the React state holding a BoardState can pass through them safely.
 */

/**
 * Returns the next player to move, derived from the board.
 * X always moves first, so when X-count equals O-count it's X's turn.
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

/**
 * Returns the winner and the winning line if one exists, else null.
 * Scans the 8 possible lines exactly once → O(1) work.
 */
export const calculateWinner = (
  board: BoardState,
): { winner: Player; line: WinningLine } | null => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const value = board[a];
    if (value !== null && value === board[b] && value === board[c]) {
      return { winner: value, line };
    }
  }
  return null;
};

/** True when every cell is filled. */
export const isBoardFull = (board: BoardState): boolean =>
  board.every((cell) => cell !== null);

/**
 * Computes the full game status as a discriminated union, so callers
 * (e.g. the UI) can switch on `status.kind` exhaustively.
 *
 * Order of checks matters: a winning board that is also full must be
 * reported as `won`, not `draw`.
 */
export const getGameStatus = (board: BoardState): GameStatus => {
  const winInfo = calculateWinner(board);
  if (winInfo !== null) {
    return { kind: "won", winner: winInfo.winner, line: winInfo.line };
  }
  if (isBoardFull(board)) {
    return { kind: "draw" };
  }
  return { kind: "in_progress", nextPlayer: getNextPlayer(board) };
};

/**
 * Returns a new BoardState with `player` placed at `index`.
 * If the cell is already occupied, returns the original board unchanged
 * (this is a guard; the UI should also disable occupied cells).
 *
 * The cast back to BoardState is safe because `.map` preserves length,
 * but TS can't infer that for fixed-length tuples.
 */
export const applyMove = (
  board: BoardState,
  index: CellIndex,
  player: Player,
): BoardState => {
  if (board[index] !== null) return board;
  const next = board.map((cell, i) => (i === index ? player : cell)) as Cell[];
  return next as unknown as BoardState;
};
