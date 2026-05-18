import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCellDimensions } from "../boardRules.ts";
import type { BoardRules } from "../boardRules.ts";
import type { BoardState, CellIndex, WinningLine as WinningLineType } from "../types.ts";
import Square from "./Square.tsx";
import WinningLine from "./WinningLine.tsx";

export type BoardProps = {
  board: BoardState;
  rules: BoardRules;
  winningLine?: WinningLineType | null;
  onCellClick: (index: CellIndex) => void;
  disabled?: boolean;
};

export default function Board({
  board,
  rules,
  winningLine = null,
  onCellClick,
  disabled = false,
}: BoardProps) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const dims = getCellDimensions(rules.size, isSm);
  const { size } = rules;

  const indices = Array.from({ length: board.length }, (_, i) => i);
  const winningSet = new Set<number>(winningLine ?? []);

  return (
    <Box
      role="grid"
      aria-label={`${size} by ${size} tic-tac-toe board`}
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${size}, ${dims.cell}px)`,
        gridTemplateRows: `repeat(${size}, ${dims.cell}px)`,
        gap: `${dims.gap}px`,
        justifyContent: "center",
        alignContent: "center",
        p: `${dims.padding}px`,
        bgcolor: "action.hover",
        borderRadius: 3,
        maxWidth: "100%",
        overflow: "auto",
      }}
    >
      {indices.map((index) => (
        <Square
          key={index}
          value={board[index] ?? null}
          cellSize={dims.cell}
          isWinning={winningSet.has(index)}
          disabled={disabled}
          onClick={() => onCellClick(index)}
        />
      ))}
      {winningLine && winningLine.length >= 2 && (
        <WinningLine
          key={winningLine.join("-")}
          line={winningLine}
          boardSize={size}
          cellSize={dims.cell}
          gap={dims.gap}
          padding={dims.padding}
        />
      )}
    </Box>
  );
}
