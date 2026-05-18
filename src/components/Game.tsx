import { useCallback, useEffect, useRef, useState } from "react";
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
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import Board from "./Board.tsx";
import MoveHistory from "./MoveHistory.tsx";
import Scoreboard from "./Scoreboard.tsx";
import StatusBar from "./StatusBar.tsx";
import { applyMove, getGameStatus } from "../gameLogic.ts";
import {
  EMPTY_BOARD,
  type BoardState,
  type CellIndex,
  type Scoreboard as ScoreboardType,
} from "../types.ts";

const INITIAL_SCORE: ScoreboardType = { X: 0, O: 0, draws: 0 };

const HISTORY_DRAWER_WIDTH = 300;

type GameHistoryState = {
  history: BoardState[];
  currentStep: number;
};

const INITIAL_GAME_HISTORY: GameHistoryState = {
  history: [EMPTY_BOARD],
  currentStep: 0,
};

/**
 * Top-level game component.
 *
 * State model:
 *  - `history` + `currentStep` : board snapshots for time travel.
 *    The visible board is always `history[currentStep]`.
 *  - `score`                   : persistent X/O/draw tallies across rounds.
 *  - Everything else (next player, winner, line) is *derived* via
 *    `getGameStatus(board)` so the UI can never drift out of sync.
 *
 * Making a move while viewing a past step truncates future history and
 * branches from that point (classic React tic-tac-toe behaviour).
 */
export default function Game() {
  const [{ history, currentStep }, setGameHistory] =
    useState<GameHistoryState>(INITIAL_GAME_HISTORY);
  const [score, setScore] = useState<ScoreboardType>(INITIAL_SCORE);
  const [historyOpen, setHistoryOpen] = useState(false);

  const board = history[currentStep];
  const isAtLatestStep = currentStep === history.length - 1;
  const moveCount = history.length - 1;

  const status = getGameStatus(board);
  const isGameOver = status.kind !== "in_progress";
  const winningLine = status.kind === "won" ? status.line : null;

  const countedRef = useRef(false);
  const newGameButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isAtLatestStep || countedRef.current) return;
    if (status.kind === "won") {
      const winner = status.winner;
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      countedRef.current = true;
    } else if (status.kind === "draw") {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      countedRef.current = true;
    }
  }, [status, isAtLatestStep]);

  useEffect(() => {
    if (isGameOver && isAtLatestStep) {
      newGameButtonRef.current?.focus();
    }
  }, [isGameOver, isAtLatestStep]);

  const handleCellClick = useCallback((index: CellIndex) => {
    setGameHistory(({ history: prevHistory, currentStep: prevStep }) => {
      const currentBoard = prevHistory[prevStep];
      const currentStatus = getGameStatus(currentBoard);
      if (currentStatus.kind !== "in_progress") {
        return { history: prevHistory, currentStep: prevStep };
      }
      if (currentBoard[index] !== null) {
        return { history: prevHistory, currentStep: prevStep };
      }

      const nextBoard = applyMove(
        currentBoard,
        index,
        currentStatus.nextPlayer,
      );
      const nextHistory = [
        ...prevHistory.slice(0, prevStep + 1),
        nextBoard,
      ];
      countedRef.current = false;
      return {
        history: nextHistory,
        currentStep: nextHistory.length - 1,
      };
    });
  }, []);

  const handleJumpToStep = useCallback((step: number) => {
    setGameHistory((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, prev.history.length - 1)),
    }));
  }, []);

  const handleJumpToStepFromDrawer = useCallback(
    (step: number) => {
      handleJumpToStep(step);
      setHistoryOpen(false);
    },
    [handleJumpToStep],
  );

  const handleNewGame = useCallback(() => {
    setGameHistory(INITIAL_GAME_HISTORY);
    countedRef.current = false;
    setHistoryOpen(false);
  }, []);

  const handleResetAll = useCallback(() => {
    setGameHistory(INITIAL_GAME_HISTORY);
    setScore(INITIAL_SCORE);
    countedRef.current = false;
    setHistoryOpen(false);
  }, []);

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

      <Board
        board={board}
        winningLine={winningLine}
        disabled={isGameOver}
        onCellClick={handleCellClick}
      />

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
