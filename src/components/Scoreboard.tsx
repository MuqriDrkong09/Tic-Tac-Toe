import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Scoreboard as ScoreboardType } from "../types.ts";

/**
 * Compact scoreboard with three cards: X wins, Draws, O wins.
 * Each card uses the player's theme color for instant recognition.
 */
export type ScoreboardProps = {
  score: ScoreboardType;
};

type Tone = "primary" | "secondary" | "neutral";

const ScoreCard = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: Tone;
}) => {
  const colorMap: Record<Tone, { bg: string; fg: string; border: string }> = {
    primary: { bg: "primary.main", fg: "common.white", border: "primary.dark" },
    secondary: {
      bg: "secondary.main",
      fg: "common.white",
      border: "secondary.dark",
    },
    neutral: { bg: "background.paper", fg: "text.primary", border: "divider" },
  };
  const { bg, fg, border } = colorMap[tone];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        py: 1.25,
        px: 1,
        textAlign: "center",
        bgcolor: bg,
        color: fg,
        border: 1,
        borderColor: border,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        component="div"
        sx={{ fontWeight: 800, lineHeight: 1.2 }}
      >
        {value}
      </Typography>
    </Paper>
  );
};

export default function Scoreboard({ score }: ScoreboardProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ width: "100%" }}
      aria-label="Scoreboard"
    >
      <ScoreCard label="X WINS" value={score.X} tone="primary" />
      <ScoreCard label="DRAWS" value={score.draws} tone="neutral" />
      <ScoreCard label="O WINS" value={score.O} tone="secondary" />
    </Stack>
  );
}
