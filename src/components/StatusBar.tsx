import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import type { GameStatus, Player } from "../types.ts";

/**
 * Banner above the board that communicates the current game state.
 *
 * Visual treatment changes per status:
 *  - in_progress: neutral card + "Next:" + a colored chip showing the player
 *  - won:         green-tinted card + trophy icon + "<P> wins!"
 *  - draw:        warm-tinted card + handshake icon + "It's a draw"
 *
 * The Player letters (X / O) always use their theme colors
 * (primary / secondary) so the UI is consistent with the board.
 */
export type StatusBarProps = {
  status: GameStatus;
};

const PlayerBadge = ({ player }: { player: Player }) => (
  <Box
    component="span"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 32,
      height: 32,
      borderRadius: "50%",
      bgcolor: player === "X" ? "primary.main" : "secondary.main",
      color: "common.white",
      fontWeight: 800,
      fontSize: "1.1rem",
      lineHeight: 1,
    }}
    aria-label={`Player ${player}`}
  >
    {player}
  </Box>
);

export default function StatusBar({ status }: StatusBarProps) {
  let icon: React.ReactNode;
  let content: React.ReactNode;
  let bgcolor: string;
  let borderColor: string;

  switch (status.kind) {
    case "in_progress":
      icon = (
        <PlayCircleOutlineRoundedIcon
          sx={{ fontSize: 28, color: "text.secondary" }}
        />
      );
      content = (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography variant="h6" component="span" color="text.primary">
            Next:
          </Typography>
          <PlayerBadge player={status.nextPlayer} />
        </Stack>
      );
      bgcolor = "background.paper";
      borderColor = "divider";
      break;

    case "won":
      icon = (
        <EmojiEventsRoundedIcon sx={{ fontSize: 28, color: "success.main" }} />
      );
      content = (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <PlayerBadge player={status.winner} />
          <Typography variant="h6" component="span" color="success.dark">
            wins!
          </Typography>
        </Stack>
      );
      bgcolor = "success.light";
      borderColor = "success.main";
      break;

    case "draw":
      icon = (
        <HandshakeRoundedIcon sx={{ fontSize: 28, color: "warning.dark" }} />
      );
      content = (
        <Typography variant="h6" component="span" color="warning.dark">
          It's a draw
        </Typography>
      );
      bgcolor = "warning.light";
      borderColor = "warning.main";
      break;
  }

  return (
    <Paper
      role="status"
      aria-live="polite"
      elevation={0}
      sx={{
        width: "100%",
        px: 2,
        py: 1.5,
        bgcolor,
        border: 1,
        borderColor,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        transition: "background-color 250ms ease, border-color 250ms ease",
      }}
    >
      {icon}
      {content}
    </Paper>
  );
}
