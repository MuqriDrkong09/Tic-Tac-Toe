import { useEffect, useState, type FormEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import type {
  AiDifficulty,
  GameConfig,
  GameMode,
  Player,
} from "../types.ts";

export type PreGameSetupProps = {
  initialConfig?: GameConfig | null;
  onStart: (config: GameConfig) => void;
};

type SetupForm = {
  gameMode: GameMode;
  aiDifficulty: AiDifficulty;
  humanPlayer: Player;
  nameX: string;
  nameO: string;
};

const DEFAULT_PVP_NAMES = { nameX: "Player 1", nameO: "Player 2" } as const;

const buildConfig = (form: SetupForm): GameConfig => ({
  gameMode: form.gameMode,
  aiDifficulty: form.aiDifficulty,
  humanPlayer: form.humanPlayer,
  names: {
    X: form.nameX.trim() || "Player X",
    O: form.nameO.trim() || "Player O",
  },
});

const formFromConfig = (config: GameConfig | null | undefined): SetupForm => {
  if (config === null || config === undefined) {
    return {
      gameMode: "pvp",
      aiDifficulty: "medium",
      humanPlayer: "X",
      ...DEFAULT_PVP_NAMES,
    };
  }
  return {
    gameMode: config.gameMode,
    aiDifficulty: config.aiDifficulty,
    humanPlayer: config.humanPlayer,
    nameX: config.names.X,
    nameO: config.names.O,
  };
};

export default function PreGameSetup({
  initialConfig,
  onStart,
}: PreGameSetupProps) {
  const [form, setForm] = useState<SetupForm>(() =>
    formFromConfig(initialConfig),
  );

  useEffect(() => {
    setForm(formFromConfig(initialConfig));
  }, [initialConfig]);

  const setField = <K extends keyof SetupForm>(key: K, value: SetupForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "gameMode") {
        if (value === "vs_ai") {
          next.humanPlayer = "X";
          next.nameX = "You";
          next.nameO = "Computer";
        } else {
          next.nameX = DEFAULT_PVP_NAMES.nameX;
          next.nameO = DEFAULT_PVP_NAMES.nameO;
        }
      }
      if (key === "humanPlayer" && next.gameMode === "vs_ai") {
        if (value === "X") {
          next.nameX = "You";
          next.nameO = "Computer";
        } else {
          next.nameX = "Computer";
          next.nameO = "You";
        }
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onStart(buildConfig(form));
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      variant="outlined"
      sx={{
        width: "100%",
        p: { xs: 2.5, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          New game
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose how you want to play. X always takes the first move.
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Mode
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={form.gameMode}
          onChange={(_, value: GameMode | null) => {
            if (value !== null) setField("gameMode", value);
          }}
          aria-label="Game mode"
        >
          <ToggleButton value="pvp">2 players</ToggleButton>
          <ToggleButton value="vs_ai">vs Computer</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {form.gameMode === "vs_ai" && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel id="ai-difficulty-label">AI difficulty</InputLabel>
            <Select
              labelId="ai-difficulty-label"
              value={form.aiDifficulty}
              label="AI difficulty"
              onChange={(e) =>
                setField("aiDifficulty", e.target.value as AiDifficulty)
              }
            >
              <MenuItem value="easy">Easy — random</MenuItem>
              <MenuItem value="medium">Medium — blocks &amp; attacks</MenuItem>
              <MenuItem value="hard">Hard — minimax (unbeatable)</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              You play as
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={form.humanPlayer}
              onChange={(_, value: Player | null) => {
                if (value !== null) setField("humanPlayer", value);
              }}
              aria-label="Your side"
            >
              <ToggleButton value="X">X (go first)</ToggleButton>
              <ToggleButton value="O">O (go second)</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </>
      )}

      <Stack spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={700}>
          Player names
        </Typography>
        <TextField
          label="Player X"
          value={form.nameX}
          onChange={(e) => setField("nameX", e.target.value)}
          fullWidth
          size="small"
          inputProps={{ maxLength: 20 }}
          disabled={form.gameMode === "vs_ai" && form.humanPlayer === "O"}
        />
        <TextField
          label="Player O"
          value={form.nameO}
          onChange={(e) => setField("nameO", e.target.value)}
          fullWidth
          size="small"
          inputProps={{ maxLength: 20 }}
          disabled={form.gameMode === "vs_ai" && form.humanPlayer === "X"}
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        size="large"
        startIcon={<PlayArrowRoundedIcon />}
        fullWidth
      >
        Start game
      </Button>
    </Paper>
  );
}
