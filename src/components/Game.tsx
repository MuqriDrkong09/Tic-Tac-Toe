import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import { isAiTurn, pickAiMove } from "../ai.ts";
import Board from "./Board.tsx";
import GameSettings from "./GameSettings.tsx";
import MoveHistory from "./MoveHistory.tsx";
import Scoreboard from "./Scoreboard.tsx";
import StatusBar from "./StatusBar.tsx";
import { getGameStatus } from "../gameLogic.ts";
import {
  INITIAL_GAME_HISTORY,
  canRedo,
  canUndo,
  gameReducer,
  isAtLatestStep,
  selectBoard,
  type GameAction,
} from "../gameReducer.ts";
import type {
  AiDifficulty,
  CellIndex,
  GameMode,
  Player,
  Scoreboard as ScoreboardType,
} from "../types.ts";

const INITIAL_SCORE: ScoreboardType = { X: 0, O: 0, draws: 0 };

const HISTORY_DRAWER_WIDTH = 300;
const HUMAN_PLAYER: Player = "X";
const AI_PLAYER: Player = "O";
const AI_MOVE_DELAY_MS = 450;

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

/**
 * Top-level game component.
 *
 * Board timeline is managed by `gameReducer` (history + currentStep).
 * Undo/redo move the step pointer; PLAY_MOVE truncates when branching.
 */
export default function Game() {
  const [gameState, dispatch] = useReducer(
    gameReducer,
    INITIAL_GAME_HISTORY,
  );
  const [score, setScore] = useState<ScoreboardType>(INITIAL_SCORE);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>("medium");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const { history, currentStep } = gameState;
  const board = selectBoard(gameState);
  const atLatest = isAtLatestStep(gameState);
  const undoAvailable = canUndo(gameState);
  const redoAvailable = canRedo(gameState);
  const moveCount = history.length - 1;

  const status = getGameStatus(board);
  const isGameOver = status.kind !== "in_progress";
  const winningLine = status.kind === "won" ? status.line : null;

  const isHumanTurn =
    gameMode === "pvp" ||
    (status.kind === "in_progress" && status.nextPlayer === HUMAN_PLAYER);

  const boardDisabled = isGameOver || !isHumanTurn || isAiThinking;

  const countedRef = useRef(false);
  const newGameButtonRef = useRef<HTMLButtonElement | null>(null);

  const dispatchGame = useCallback((action: GameAction) => {
    if (action.type === "PLAY_MOVE" || action.type === "NEW_GAME") {
      countedRef.current = false;
    }
    dispatch(action);
  }, []);

  useEffect(() => {
    if (!atLatest || countedRef.current) return;
    if (status.kind === "won") {
      const winner = status.winner;
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      countedRef.current = true;
    } else if (status.kind === "draw") {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      countedRef.current = true;
    }
  }, [status, atLatest]);

  useEffect(() => {
    if (isGameOver && atLatest) {
      newGameButtonRef.current?.focus();
    }
  }, [isGameOver, atLatest]);

  useEffect(() => {
    if (gameMode !== "vs_ai" || !atLatest) return;
    if (!isAiTurn(board, gameMode, AI_PLAYER)) return;

    setIsAiThinking(true);
    const timer = window.setTimeout(() => {
      const move = pickAiMove(board, aiDifficulty, AI_PLAYER);
      if (move !== null) {
        dispatchGame({ type: "PLAY_MOVE", index: move });
      }
      setIsAiThinking(false);
    }, AI_MOVE_DELAY_MS);

    return () => {
      clearTimeout(timer);
      setIsAiThinking(false);
    };
  }, [board, gameMode, atLatest, aiDifficulty, dispatchGame]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;

      const key = event.key.toLowerCase();

      if (key === "z" && !event.shiftKey && undoAvailable) {
        event.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      if (
        (key === "z" && event.shiftKey && redoAvailable) ||
        (key === "y" && redoAvailable)
      ) {
        event.preventDefault();
        dispatch({ type: "REDO" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undoAvailable, redoAvailable]);

  const handleCellClick = useCallback(
    (index: CellIndex) => {
      if (!isHumanTurn || isAiThinking) return;
      dispatchGame({ type: "PLAY_MOVE", index });
    },
    [dispatchGame, isHumanTurn, isAiThinking],
  );

  const handleGameModeChange = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      dispatchGame({ type: "NEW_GAME" });
    },
    [dispatchGame],
  );

  const handleAiDifficultyChange = useCallback(
    (difficulty: AiDifficulty) => {
      setAiDifficulty(difficulty);
      if (gameMode === "vs_ai") {
        dispatchGame({ type: "NEW_GAME" });
      }
    },
    [dispatchGame, gameMode],
  );

  const handleJumpToStep = useCallback((step: number) => {
    dispatch({ type: "JUMP_TO_STEP", step });
  }, []);

  const handleJumpToStepFromDrawer = useCallback(
    (step: number) => {
      handleJumpToStep(step);
      setHistoryOpen(false);
    },
    [handleJumpToStep],
  );

  const handleUndo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const handleRedo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const handleNewGame = useCallback(() => {
    dispatchGame({ type: "NEW_GAME" });
    setHistoryOpen(false);
  }, [dispatchGame]);

  const handleResetAll = useCallback(() => {
    dispatchGame({ type: "NEW_GAME" });
    setScore(INITIAL_SCORE);
    setHistoryOpen(false);
  }, [dispatchGame]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2.5,
        width: "100%",
      }}
    >
      <Scoreboard score={score} />

      <GameSettings
        gameMode={gameMode}
        aiDifficulty={aiDifficulty}
        onGameModeChange={handleGameModeChange}
        onAiDifficultyChange={handleAiDifficultyChange}
      />

      <Stack direction="row" spacing={1} alignItems="stretch" sx={{ width: "100%" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <StatusBar status={status} />
        </Box>
        <Tooltip title="Move history">
          <IconButton
            onClick={() => setHistoryOpen(true)}
            aria-label="Open move history"
            sx={{
              flexShrink: 0,
              alignSelf: "center",
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            <Badge
              badgeContent={moveCount}
              color="primary"
              invisible={moveCount === 0}
              max={99}
            >
              <MenuRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Stack>

      {isAiThinking && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
          aria-live="polite"
        >
          Computer is thinking…
        </Typography>
      )}

      <Board
        board={board}
        winningLine={winningLine}
        disabled={boardDisabled}
        onCellClick={handleCellClick}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ width: "100%" }}
      >
        <Tooltip title="Undo (Ctrl+Z)">
          <span style={{ flex: 1, display: "flex" }}>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<UndoRoundedIcon />}
              onClick={handleUndo}
              disabled={!undoAvailable}
              fullWidth
              aria-label="Undo last move"
            >
              Undo
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Redo (Ctrl+Shift+Z)">
          <span style={{ flex: 1, display: "flex" }}>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<RedoRoundedIcon />}
              onClick={handleRedo}
              disabled={!redoAvailable}
              fullWidth
              aria-label="Redo move"
            >
              Redo
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ width: "100%", pt: 0.5 }}
      >
        <Button
          ref={newGameButtonRef}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<RestartAltRoundedIcon />}
          onClick={handleNewGame}
          sx={{ flex: 1 }}
        >
          New game
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={handleResetAll}
          sx={{ flex: 1 }}
        >
          Reset all
        </Button>
      </Stack>

      <Drawer
        anchor="right"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: HISTORY_DRAWER_WIDTH,
              maxWidth: "90vw",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Move history
            </Typography>
            <IconButton
              onClick={() => setHistoryOpen(false)}
              aria-label="Close move history"
              edge="end"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <MoveHistory
            embedded
            history={history}
            currentStep={currentStep}
            onJumpToStep={handleJumpToStepFromDrawer}
          />
        </Box>
      </Drawer>
    </Box>
  );
}
