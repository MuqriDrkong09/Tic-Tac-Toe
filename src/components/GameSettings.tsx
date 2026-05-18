import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { AiDifficulty, GameMode } from "../types.ts";

export type GameSettingsProps = {
  gameMode: GameMode;
  aiDifficulty: AiDifficulty;
  onGameModeChange: (mode: GameMode) => void;
  onAiDifficultyChange: (difficulty: AiDifficulty) => void;
};

export default function GameSettings({
  gameMode,
  aiDifficulty,
  onGameModeChange,
  onAiDifficultyChange,
}: GameSettingsProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Game mode
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={gameMode}
          onChange={(_, value: GameMode | null) => {
            if (value !== null) onGameModeChange(value);
          }}
          aria-label="Game mode"
        >
          <ToggleButton value="pvp">2 players</ToggleButton>
          <ToggleButton value="vs_ai">vs Computer</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {gameMode === "vs_ai" && (
        <FormControl fullWidth size="small">
          <InputLabel id="ai-difficulty-label">AI difficulty</InputLabel>
          <Select
            labelId="ai-difficulty-label"
            id="ai-difficulty"
            value={aiDifficulty}
            label="AI difficulty"
            onChange={(e) =>
              onAiDifficultyChange(e.target.value as AiDifficulty)
            }
          >
            <MenuItem value="easy">Easy — random moves</MenuItem>
            <MenuItem value="medium">Medium — blocks &amp; attacks</MenuItem>
            <MenuItem value="hard">Hard — unbeatable (minimax)</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            You play as X. The computer plays as O.
          </Typography>
        </FormControl>
      )}
    </Paper>
  );
}
