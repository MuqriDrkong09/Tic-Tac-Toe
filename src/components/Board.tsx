import Box from "@mui/material/Box";
import Square from "./Square.tsx";
import type { BoardState, CellIndex, WinningLine } from "../types.ts";

/**
 * Purely presentational 3x3 grid of Squares.
 *
 * All state (board, winner, etc.) lives in the parent <Game/> component;
 * this component just renders and forwards clicks.
 */
export type BoardProps = {
  board: BoardState;
  winningLine?: WinningLine | null;
  onCellClick: (index: CellIndex) => void;
  disabled?: boolean;
};

const CELL_INDICES: readonly CellIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

export default function Board({
  board,
  winningLine = null,
  onCellClick,
  disabled = false,
}: BoardProps) {
  const winningSet = new Set<CellIndex>(winningLine ?? []);

  return (
    <Box
      role="grid"
      aria-label="Tic-tac-toe board"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, auto)",
        gridTemplateRows: "repeat(3, auto)",
        gap: { xs: 1, sm: 1.5 },
        justifyContent: "center",
        alignContent: "center",
        p: { xs: 1, sm: 1.5 },
        bgcolor: "action.hover",
        borderRadius: 3,
      }}
    >
      {CELL_INDICES.map((index) => (
        <Square
          key={index}
          value={board[index]}
          isWinning={winningSet.has(index)}
          disabled={disabled}
          onClick={() => onCellClick(index)}
        />
      ))}
    </Box>
  );
}
