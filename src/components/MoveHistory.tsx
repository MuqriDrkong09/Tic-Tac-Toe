import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { formatCellPosition, getMoveAtStep } from "../gameLogic.ts";
import type { BoardState, Player } from "../types.ts";

export type MoveHistoryProps = {
  history: readonly BoardState[];
  currentStep: number;
  onJumpToStep: (step: number) => void;
  /** When true, fills the parent (e.g. a drawer) instead of a fixed sidebar width. */
  embedded?: boolean;
};

const playerColor = (player: Player) =>
  player === "X" ? "primary.main" : "secondary.main";

export default function MoveHistory({
  history,
  currentStep,
  onJumpToStep,
  embedded = false,
}: MoveHistoryProps) {
  const isViewingPast = currentStep < history.length - 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...(embedded
          ? { flex: 1, minHeight: 0 }
          : {
              width: "100%",
              flexShrink: 0,
              maxHeight: 360,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }),
      }}
    >
      {!embedded && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 1.25,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <HistoryRoundedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2" fontWeight={700}>
            Move history
          </Typography>
        </Box>
      )}

      {isViewingPast && (
        <Typography
          variant="caption"
          color="warning.dark"
          sx={{
            px: 1.5,
            py: 0.75,
            bgcolor: "warning.light",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          Viewing move {currentStep} of {history.length - 1}
        </Typography>
      )}

      <List
        dense
        disablePadding
        sx={{
          overflowY: "auto",
          flex: 1,
          py: 0.5,
        }}
        aria-label="Move history"
      >
        <ListItemButton
          selected={currentStep === 0}
          onClick={() => onJumpToStep(0)}
          sx={{ py: 0.75 }}
        >
          <ListItemText
            primary="Game start"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </ListItemButton>

        {history.slice(1).map((_, index) => {
          const step = index + 1;
          const move = getMoveAtStep(history, step);
          if (move === null) return null;

          const label = (
            <>
              <Box
                component="span"
                sx={{ color: playerColor(move.player), fontWeight: 800 }}
              >
                {move.player}
              </Box>
              {" → cell "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {formatCellPosition(move.cellIndex)}
              </Box>
            </>
          );

          return (
            <ListItemButton
              key={step}
              selected={currentStep === step}
              onClick={() => onJumpToStep(step)}
              sx={{ py: 0.75 }}
            >
              <ListItemText
                primary={label}
                secondary={`Move ${step}`}
                primaryTypographyProps={{ variant: "body2" }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
