import type { BoardRules } from "./boardRules.ts";
import { rowColToIndex } from "./boardRules.ts";
import {
  applyMove,
  calculateWinner,
  getGameStatus,
  isBoardFull,
} from "./gameLogic.ts";
import type { AiDifficulty, BoardState, CellIndex, Player } from "./types.ts";

export const getEmptyCells = (board: BoardState): CellIndex[] => {
  const empty: CellIndex[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) empty.push(i);
  }
  return empty;
};

const opponentOf = (player: Player): Player => (player === "X" ? "O" : "X");

const findWinningMove = (
  board: BoardState,
  player: Player,
  rules: BoardRules,
): CellIndex | null => {
  for (const index of getEmptyCells(board)) {
    const next = applyMove(board, index, player);
    if (calculateWinner(next, rules) !== null) return index;
  }
  return null;
};

const pickRandomMove = (board: BoardState): CellIndex => {
  const empty = getEmptyCells(board);
  return empty[Math.floor(Math.random() * empty.length)]!;
};

const centerIndex = (rules: BoardRules): number => {
  const mid = Math.floor(rules.size / 2);
  return rowColToIndex(mid, mid, rules.size);
};

const minimax = (
  board: BoardState,
  rules: BoardRules,
  aiPlayer: Player,
  currentPlayer: Player,
  alpha: number,
  beta: number,
): number => {
  const win = calculateWinner(board, rules);
  if (win !== null) {
    return win.winner === aiPlayer ? 10 : -10;
  }
  if (isBoardFull(board)) return 0;

  const empty = getEmptyCells(board);
  const opponent = opponentOf(currentPlayer);

  if (currentPlayer === aiPlayer) {
    let maxEval = -Infinity;
    for (const index of empty) {
      const next = applyMove(board, index, currentPlayer);
      const score = minimax(next, rules, aiPlayer, opponent, alpha, beta);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const index of empty) {
    const next = applyMove(board, index, currentPlayer);
    const score = minimax(next, rules, aiPlayer, opponent, alpha, beta);
    minEval = Math.min(minEval, score);
    beta = Math.min(beta, score);
    if (beta <= alpha) break;
  }
  return minEval;
};

const minimaxBestMove = (
  board: BoardState,
  rules: BoardRules,
  aiPlayer: Player,
): CellIndex => {
  const opponent = opponentOf(aiPlayer);
  let bestScore = -Infinity;
  let bestMove = getEmptyCells(board)[0]!;

  for (const index of getEmptyCells(board)) {
    const next = applyMove(board, index, aiPlayer);
    const score = minimax(next, rules, aiPlayer, opponent, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }
  return bestMove;
};

const pickMediumMove = (
  board: BoardState,
  rules: BoardRules,
  aiPlayer: Player,
): CellIndex => {
  const opponent = opponentOf(aiPlayer);
  const win = findWinningMove(board, aiPlayer, rules);
  if (win !== null) return win;
  const block = findWinningMove(board, opponent, rules);
  if (block !== null) return block;

  const center = centerIndex(rules);
  if (board[center] === null) return center;

  return pickRandomMove(board);
};

/**
 * Chooses the next cell for the AI.
 * Hard mode uses full minimax on 3×3 only; larger boards use the medium heuristic.
 */
export const pickAiMove = (
  board: BoardState,
  rules: BoardRules,
  difficulty: AiDifficulty,
  aiPlayer: Player,
): CellIndex | null => {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return null;

  switch (difficulty) {
    case "easy":
      return pickRandomMove(board);
    case "medium":
      return pickMediumMove(board, rules, aiPlayer);
    case "hard":
      if (rules.size === 3) {
        return minimaxBestMove(board, rules, aiPlayer);
      }
      return pickMediumMove(board, rules, aiPlayer);
  }
};

export const isAiTurn = (
  board: BoardState,
  rules: BoardRules,
  gameMode: "pvp" | "vs_ai",
  aiPlayer: Player,
): boolean => {
  if (gameMode !== "vs_ai") return false;
  const status = getGameStatus(board, rules);
  return status.kind === "in_progress" && status.nextPlayer === aiPlayer;
};
