import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Board from "./Board.tsx";
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

/**
 * Top-level game component.
 *
 * State model:
 *  - `board`  : current 3x3 board (single source of game truth).
 *  - `score`  : persistent X/O/draw tallies across rounds.
 *  - Everything else (next player, winner, line) is *derived* via
 *    `getGameStatus(board)` so the UI can never drift out of sync.
 *
 * Score increment uses a ref guard (`countedRef`) so the same finished
 * round is never tallied twice, even if React runs the effect more
 * than once (StrictMode dev double-invocation, fast HMR, etc.).
 */
export default function Game() {
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);
  const [score, setScore] = useState<ScoreboardType>(INITIAL_SCORE);

  const status = getGameStatus(board);
  const isGameOver = status.kind !== "in_progress";
  const winningLine = status.kind === "won" ? status.line : null;

  const countedRef = useRef(false);
  const newGameButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (countedRef.current) return;
    if (status.kind === "won") {
      const winner = status.winner;
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
      countedRef.current = true;
    } else if (status.kind === "draw") {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      countedRef.current = true;
    }
  }, [status]);

  useEffect(() => {
    if (isGameOver) {
      newGameButtonRef.current?.focus();
    }
  }, [isGameOver]);

  const handleCellClick = useCallback((index: CellIndex) => {
    setBoard((currentBoard) => {
      const currentStatus = getGameStatus(currentBoard);
      if (currentStatus.kind !== "in_progress") return currentBoard;
      if (currentBoard[index] !== null) return currentBoard;
      return applyMove(currentBoard, index, currentStatus.nextPlayer);
    });
  }, []);

  const handleNewGame = useCallback(() => {
    setBoard(EMPTY_BOARD);
    countedRef.current = false;
  }, []);

  const handleResetAll = useCallback(() => {
    setBoard(EMPTY_BOARD);
    setScore(INITIAL_SCORE);
    countedRef.current = false;
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
      <StatusBar status={status} />
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
    </Box>
  );
}
