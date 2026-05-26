import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import { useTranslation } from "react-i18next";
import type { GameStatus, Player } from "../types.ts";

export type StatusBarProps = {
  status: GameStatus;
  playerLabel: (player: Player) => string;
};

const PlayerBadge = ({ player }: { player: Player }) => {
  const { t } = useTranslation();
  return (
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
      aria-label={t("status.playerAria", { player })}
    >
      {player}
    </Box>
  );
};

export default function StatusBar({ status, playerLabel }: StatusBarProps) {
  const { t } = useTranslation();
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
          <PlayerBadge player={status.nextPlayer} />
          <Typography variant="h6" component="span" color="text.primary">
            {t("status.turn", { name: playerLabel(status.nextPlayer) })}
          </Typography>
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
            {t("status.wins", { name: playerLabel(status.winner) })}
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
          {t("status.draw")}
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
