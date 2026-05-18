import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import type { WinningLine as WinningLineType } from "../types.ts";

export type WinningLineProps = {
  line: WinningLineType;
  boardSize: number;
  cellSize: number;
  gap: number;
  padding: number;
};

const draw = keyframes`
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
`;

const cellCenter = (
  index: number,
  boardSize: number,
  cellSize: number,
  gap: number,
  padding: number,
) => {
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;
  return {
    x: padding + col * (cellSize + gap) + cellSize / 2,
    y: padding + row * (cellSize + gap) + cellSize / 2,
  };
};

export default function WinningLine({
  line,
  boardSize,
  cellSize,
  gap,
  padding,
}: WinningLineProps) {
  const theme = useTheme();
  const gridSpan = boardSize * cellSize + (boardSize - 1) * gap;
  const totalSize = gridSpan + 2 * padding;

  const startIdx = line[0]!;
  const endIdx = line[line.length - 1]!;
  const start = cellCenter(startIdx, boardSize, cellSize, gap, padding);
  const end = cellCenter(endIdx, boardSize, cellSize, gap, padding);

  const strokeWidth = Math.max(6, Math.min(10, cellSize / 8));

  return (
    <Box
      component="svg"
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      role="presentation"
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={theme.palette.success.main}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: `${draw} 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          filter: `drop-shadow(0 2px 6px ${theme.palette.success.main}55)`,
        }}
      />
    </Box>
  );
}
