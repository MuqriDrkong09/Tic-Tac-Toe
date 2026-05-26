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
import { useTranslation } from "react-i18next";
import i18n from "../i18n/index.ts";
import type {
  AiDifficulty,
  BoardSize,
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
  boardSize: BoardSize;
  aiDifficulty: AiDifficulty;
  humanPlayer: Player;
  nameX: string;
  nameO: string;
};

const defaultPvpNames = () => ({
  nameX: i18n.t("defaults.player1"),
  nameO: i18n.t("defaults.player2"),
});

const formFromConfig = (config: GameConfig | null | undefined): SetupForm => {
  if (config === null || config === undefined) {
    return {
      gameMode: "pvp",
      boardSize: 3,
      aiDifficulty: "medium",
      humanPlayer: "X",
      ...defaultPvpNames(),
    };
  }
  return {
    gameMode: config.gameMode,
    boardSize: config.boardSize,
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
  const { t } = useTranslation();
  const [form, setForm] = useState<SetupForm>(() =>
    formFromConfig(initialConfig),
  );

  useEffect(() => {
    setForm(formFromConfig(initialConfig));
  }, [initialConfig]);

  const buildConfig = (f: SetupForm): GameConfig => ({
    gameMode: f.gameMode,
    boardSize: f.boardSize,
    aiDifficulty: f.aiDifficulty,
    humanPlayer: f.humanPlayer,
    names: {
      X: f.nameX.trim() || t("defaults.playerX"),
      O: f.nameO.trim() || t("defaults.playerO"),
    },
  });

  const setField = <K extends keyof SetupForm>(key: K, value: SetupForm[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "gameMode") {
        if (value === "vs_ai") {
          next.humanPlayer = "X";
          next.nameX = t("defaults.you");
          next.nameO = t("defaults.computer");
        } else {
          next.nameX = t("defaults.player1");
          next.nameO = t("defaults.player2");
        }
      }
      if (key === "humanPlayer" && next.gameMode === "vs_ai") {
        if (value === "X") {
          next.nameX = t("defaults.you");
          next.nameO = t("defaults.computer");
        } else {
          next.nameX = t("defaults.computer");
          next.nameO = t("defaults.you");
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
          {t("setup.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("setup.intro", {
            count: form.boardSize,
            size: form.boardSize,
          })}
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          {t("setup.boardSize")}
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={form.boardSize}
          onChange={(_, value: BoardSize | null) => {
            if (value !== null) setField("boardSize", value);
          }}
          aria-label={t("setup.boardSizeAria")}
        >
          <ToggleButton value={3}>3×3</ToggleButton>
          <ToggleButton value={4}>4×4</ToggleButton>
          <ToggleButton value={5}>5×5</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          {t("setup.mode")}
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={form.gameMode}
          onChange={(_, value: GameMode | null) => {
            if (value !== null) setField("gameMode", value);
          }}
          aria-label={t("setup.modeAria")}
        >
          <ToggleButton value="pvp">{t("setup.pvp")}</ToggleButton>
          <ToggleButton value="vs_ai">{t("setup.vsAi")}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {form.gameMode === "vs_ai" && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel id="ai-difficulty-label">
              {t("setup.aiDifficulty")}
            </InputLabel>
            <Select
              labelId="ai-difficulty-label"
              value={form.aiDifficulty}
              label={t("setup.aiDifficulty")}
              onChange={(e) =>
                setField("aiDifficulty", e.target.value as AiDifficulty)
              }
            >
              <MenuItem value="easy">{t("setup.aiEasy")}</MenuItem>
              <MenuItem value="medium">{t("setup.aiMedium")}</MenuItem>
              <MenuItem value="hard">{t("setup.aiHard")}</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
              {t("setup.youPlayAs")}
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={form.humanPlayer}
              onChange={(_, value: Player | null) => {
                if (value !== null) setField("humanPlayer", value);
              }}
              aria-label={t("setup.yourSideAria")}
            >
              <ToggleButton value="X">{t("setup.playX")}</ToggleButton>
              <ToggleButton value="O">{t("setup.playO")}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </>
      )}

      <Stack spacing={1.5}>
        <Typography variant="subtitle2" fontWeight={700}>
          {t("setup.playerNames")}
        </Typography>
        <TextField
          label={t("setup.playerX")}
          value={form.nameX}
          onChange={(e) => setField("nameX", e.target.value)}
          fullWidth
          size="small"
          inputProps={{ maxLength: 20 }}
          disabled={form.gameMode === "vs_ai" && form.humanPlayer === "O"}
        />
        <TextField
          label={t("setup.playerO")}
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
        {t("setup.startGame")}
      </Button>
    </Paper>
  );
}
