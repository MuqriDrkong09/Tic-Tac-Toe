import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import type { WinningLine as WinningLineType } from "../types.ts";

/**
 * Absolutely-positioned SVG overlay that strokes a line from the center
 * of the first winning cell to the center of the last winning cell.
 *
 * The "drawing" effect uses the SVG `pathLength` trick:
 *  - We declare `pathLength={1}` so dasharray/dashoffset are expressed
 *    as fractions of the line length (units cancel out).
 *  - Animating dashoffset 1 → 0 reveals the stroke.
 *
 * This means a single shared keyframe works for any of the 8 winning
 * lines, regardless of pixel length.
 */
export type WinningLineProps = {
  line: WinningLineType;
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
  cellSize: number,
  gap: number,
  padding: number,
) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return {
    x: padding + col * (cellSize + gap) + cellSize / 2,
    y: padding + row * (cellSize + gap) + cellSize / 2,
  };
};

export default function WinningLine({
  line,
  cellSize,
  gap,
  padding,
}: WinningLineProps) {
  const theme = useTheme();
  const totalSize = 3 * cellSize + 2 * gap + 2 * padding;
  const start = cellCenter(line[0], cellSize, gap, padding);
  const end = cellCenter(line[2], cellSize, gap, padding);

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
        strokeWidth={10}
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
