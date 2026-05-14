import ButtonBase from "@mui/material/ButtonBase";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/system";
import type { Cell } from "../types.ts";

/**
 * A single Tic-Tac-Toe cell.
 *
 * Visuals:
 * - 96x96 (responsive on small screens) MUI ButtonBase styled as a card.
 * - X is rendered in primary color, O in secondary, both bold and large.
 * - Disabled state (occupied OR game ended) removes hover effects.
 * - `isWinning` highlights the cell as part of the winning line.
 */
export type SquareProps = {
  value: Cell;
  onClick: () => void;
  isWinning?: boolean;
  disabled?: boolean;
};

const pop = keyframes`
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
`;

export default function Square({
  value,
  onClick,
  isWinning = false,
  disabled = false,
}: SquareProps) {
  const isOccupied = value !== null;
  const isDisabled = disabled || isOccupied;

  return (
    <ButtonBase
      onClick={onClick}
      disabled={isDisabled}
      focusRipple
      aria-label={value === null ? "Empty cell" : `Cell with ${value}`}
      sx={{
        width: { xs: 80, sm: 96 },
        height: { xs: 80, sm: 96 },
        borderRadius: 2,
        bgcolor: isWinning ? "success.light" : "background.paper",
        boxShadow: 2,
        transition: "transform 120ms ease, background-color 200ms ease, box-shadow 200ms ease",
        cursor: isDisabled ? "default" : "pointer",
        "&:hover": isDisabled
          ? {}
          : {
              transform: "translateY(-2px)",
              boxShadow: 4,
              bgcolor: "action.hover",
            },
        "&.Mui-disabled": {
          opacity: 1,
        },
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 800,
          fontSize: { xs: "2.5rem", sm: "3rem" },
          lineHeight: 1,
          color: value === "X" ? "primary.main" : "secondary.main",
          animation: value !== null ? `${pop} 180ms ease-out` : "none",
          userSelect: "none",
        }}
      >
        {value ?? ""}
      </Box>
    </ButtonBase>
  );
}
