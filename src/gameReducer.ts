import { applyMove, getGameStatus } from "./gameLogic.ts";
import {
  EMPTY_BOARD,
  type BoardState,
  type CellIndex,
} from "./types.ts";

/**
 * Board timeline state: every snapshot plus the index of the one on screen.
 * Undo/redo only move `currentStep`; PLAY_MOVE truncates future steps when
 * branching from the past.
 */
export type GameHistoryState = {
  readonly history: BoardState[];
  readonly currentStep: number;
};

export const INITIAL_GAME_HISTORY: GameHistoryState = {
  history: [EMPTY_BOARD],
  currentStep: 0,
};

export type GameAction =
  | { type: "PLAY_MOVE"; index: CellIndex }
  | { type: "JUMP_TO_STEP"; step: number }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "NEW_GAME" };

export const selectBoard = (state: GameHistoryState): BoardState =>
  state.history[state.currentStep];

export const canUndo = (state: GameHistoryState): boolean =>
  state.currentStep > 0;

export const canRedo = (state: GameHistoryState): boolean =>
  state.currentStep < state.history.length - 1;

export const isAtLatestStep = (state: GameHistoryState): boolean =>
  state.currentStep === state.history.length - 1;

const clampStep = (step: number, historyLength: number): number =>
  Math.max(0, Math.min(step, historyLength - 1));

export function gameReducer(
  state: GameHistoryState,
  action: GameAction,
): GameHistoryState {
  switch (action.type) {
    case "UNDO":
      if (!canUndo(state)) return state;
      return { ...state, currentStep: state.currentStep - 1 };

    case "REDO":
      if (!canRedo(state)) return state;
      return { ...state, currentStep: state.currentStep + 1 };

    case "JUMP_TO_STEP":
      return {
        ...state,
        currentStep: clampStep(action.step, state.history.length),
      };

    case "NEW_GAME":
      return INITIAL_GAME_HISTORY;

    case "PLAY_MOVE": {
      const currentBoard = state.history[state.currentStep];
      const currentStatus = getGameStatus(currentBoard);
      if (currentStatus.kind !== "in_progress") return state;
      if (currentBoard[action.index] !== null) return state;

      const nextBoard = applyMove(
        currentBoard,
        action.index,
        currentStatus.nextPlayer,
      );
      const nextHistory = [
        ...state.history.slice(0, state.currentStep + 1),
        nextBoard,
      ];
      return {
        history: nextHistory,
        currentStep: nextHistory.length - 1,
      };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
