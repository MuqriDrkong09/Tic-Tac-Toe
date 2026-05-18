import {
  applyMove,
  calculateWinner,
  getGameStatus,
  isBoardFull,
} from "./gameLogic.ts";
import type { AiDifficulty, BoardState, CellIndex, Player } from "./types.ts";

const ALL_INDICES: readonly CellIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export const getEmptyCells = (board: BoardState): CellIndex[] =>
  ALL_INDICES.filter((index) => board[index] === null);

const opponentOf = (player: Player): Player => (player === "X" ? "O" : "X");

/** Returns a winning move for `player` if one exists, otherwise null. */
const findWinningMove = (
  board: BoardState,
  player: Player,
): CellIndex | null => {
  for (const index of getEmptyCells(board)) {
    const next = applyMove(board, index, player);
    if (calculateWinner(next) !== null) return index;
  }
  return null;
};

const pickRandomMove = (board: BoardState): CellIndex => {
  const empty = getEmptyCells(board);
  return empty[Math.floor(Math.random() * empty.length)]!;
};

const minimax = (
  board: BoardState,
  aiPlayer: Player,
  currentPlayer: Player,
  alpha: number,
  beta: number,
): number => {
  const win = calculateWinner(board);
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
      const score = minimax(next, aiPlayer, opponent, alpha, beta);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const index of empty) {
    const next = applyMove(board, index, currentPlayer);
    const score = minimax(next, aiPlayer, opponent, alpha, beta);
    minEval = Math.min(minEval, score);
    beta = Math.min(beta, score);
    if (beta <= alpha) break;
  }
  return minEval;
};

const minimaxBestMove = (board: BoardState, aiPlayer: Player): CellIndex => {
  const opponent = opponentOf(aiPlayer);
  let bestScore = -Infinity;
  let bestMove = getEmptyCells(board)[0]!;

  for (const index of getEmptyCells(board)) {
    const next = applyMove(board, index, aiPlayer);
    const score = minimax(next, aiPlayer, opponent, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }
  return bestMove;
};

/**
 * Chooses the next cell for the AI on the given board.
 * Assumes `aiPlayer` is the player to move next.
 */
export const pickAiMove = (
  board: BoardState,
  difficulty: AiDifficulty,
  aiPlayer: Player,
): CellIndex | null => {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return null;

  const opponent = opponentOf(aiPlayer);

  switch (difficulty) {
    case "easy":
      return pickRandomMove(board);

    case "medium": {
      const win = findWinningMove(board, aiPlayer);
      if (win !== null) return win;
      const block = findWinningMove(board, opponent);
      if (block !== null) return block;
      if (board[4] === null) return 4;
      return pickRandomMove(board);
    }

    case "hard":
      return minimaxBestMove(board, aiPlayer);
  }
};

/** True when the side to move is the AI in vs-AI mode. */
export const isAiTurn = (
  board: BoardState,
  gameMode: "pvp" | "vs_ai",
  aiPlayer: Player,
): boolean => {
  if (gameMode !== "vs_ai") return false;
  const status = getGameStatus(board);
  return status.kind === "in_progress" && status.nextPlayer === aiPlayer;
};
