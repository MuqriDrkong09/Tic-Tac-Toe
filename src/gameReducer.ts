import { createEmptyBoard } from "./boardRules.ts";
import type { BoardRules } from "./boardRules.ts";
import { applyMove, getGameStatus } from "./gameLogic.ts";
import type { BoardState, CellIndex } from "./types.ts";

export type GameHistoryState = {
  readonly history: BoardState[];
  readonly currentStep: number;
  readonly rules: BoardRules;
};

export const createInitialHistory = (rules: BoardRules): GameHistoryState => ({
  history: [createEmptyBoard(rules.size)],
  currentStep: 0,
  rules,
});

export type GameAction =
  | { type: "PLAY_MOVE"; index: CellIndex }
  | { type: "JUMP_TO_STEP"; step: number }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "NEW_GAME"; rules: BoardRules }
  | { type: "RESET"; rules: BoardRules };

export const selectBoard = (state: GameHistoryState): BoardState =>
  state.history[state.currentStep]!;

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
    case "RESET":
      return createInitialHistory(action.rules);

    case "PLAY_MOVE": {
      const currentBoard = state.history[state.currentStep]!;
      const currentStatus = getGameStatus(currentBoard, state.rules);
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
        ...state,
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
