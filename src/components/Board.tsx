import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Square from "./Square.tsx";
import WinningLine from "./WinningLine.tsx";
import type { BoardState, CellIndex, WinningLine as WinningLineType } from "../types.ts";

/**
 * Purely presentational 3x3 grid of Squares with an optional animated
 * SVG winning-line overlay.
 *
 * All state (board, winner, etc.) lives in the parent <Game/> component;
 * this component just renders and forwards clicks.
 */
export type BoardProps = {
  board: BoardState;
  winningLine?: WinningLineType | null;
  onCellClick: (index: CellIndex) => void;
  disabled?: boolean;
};

const CELL_INDICES: readonly CellIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

// These must mirror the responsive `sx` values used below so the
// WinningLine overlay aligns pixel-perfectly with the rendered cells.
const SIZE_SM = { cell: 96, gap: 12, padding: 12 };
const SIZE_XS = { cell: 80, gap: 8, padding: 8 };

export default function Board({
  board,
  winningLine = null,
  onCellClick,
  disabled = false,
}: BoardProps) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const dims = isSm ? SIZE_SM : SIZE_XS;

  const winningSet = new Set<CellIndex>(winningLine ?? []);

  return (
    <Box
      role="grid"
      aria-label="Tic-tac-toe board"
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(3, ${dims.cell}px)`,
        gridTemplateRows: `repeat(3, ${dims.cell}px)`,
        gap: `${dims.gap}px`,
        justifyContent: "center",
        alignContent: "center",
        p: `${dims.padding}px`,
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
      {winningLine && (
        <WinningLine
          key={winningLine.join("-")}
          line={winningLine}
          cellSize={dims.cell}
          gap={dims.gap}
          padding={dims.padding}
        />
      )}
    </Box>
  );
}
