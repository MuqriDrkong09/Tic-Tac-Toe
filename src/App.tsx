import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ThemeProvider, type PaletteMode } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import Game from "./components/Game.tsx";
import LanguageSwitcher from "./i18n/LanguageSwitcher.tsx";
import { SoundProvider, useSound } from "./SoundContext.tsx";
import { createAppTheme } from "./theme.ts";
import { useTranslation } from "react-i18next";

const COLOR_MODE_STORAGE_KEY = "tic-tac-toe-color-mode";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/**
 * Reads the initial color mode from localStorage, falling back to the
 * operating system preference (`prefers-color-scheme`).
 *
 * Wrapped in a try/catch because some browser sandboxes throw on
 * `localStorage` access (e.g. third-party-cookie blocking).
 */
const getInitialMode = (): PaletteMode => {
  try {
    const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // ignore storage access errors
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

function AppHeader({
  mode,
  onToggleMode,
}: {
  mode: PaletteMode;
  onToggleMode: () => void;
}) {
  const { t } = useTranslation();
  const { soundEnabled, toggleSound } = useSound();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Typography variant="h1" color="primary" sx={{ flexGrow: 1 }}>
        {t("app.title")}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <LanguageSwitcher />
        <Tooltip
          title={
            soundEnabled ? t("header.muteSound") : t("header.enableSound")
          }
        >
          <IconButton
            onClick={toggleSound}
            color="inherit"
            aria-label={
              soundEnabled ? t("header.muteSound") : t("header.enableSound")
            }
            aria-pressed={soundEnabled}
            sx={{
              color: "text.secondary",
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            {soundEnabled ? (
              <VolumeUpRoundedIcon />
            ) : (
              <VolumeOffRoundedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={mode === "light" ? t("header.darkMode") : t("header.lightMode")}
        >
          <IconButton
            onClick={onToggleMode}
            color="inherit"
            aria-label={
              mode === "light" ? t("header.darkMode") : t("header.lightMode")
            }
            sx={{
              color: "text.secondary",
              bgcolor: "action.hover",
              "&:hover": { bgcolor: "action.selected" },
            }}
          >
            {mode === "light" ? (
              <DarkModeRoundedIcon />
            ) : (
              <LightModeRoundedIcon />
            )}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

export default function App() {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    } catch {
      // ignore storage access errors
    }
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleMode = () =>
    setMode((current) => (current === "light" ? "dark" : "light"));

  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("app.title");
  }, [t, i18n.language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SoundProvider>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            py: 4,
            px: 2,
          }}
        >
          <Container maxWidth="md" disableGutters>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                animation: `${fadeUp} 420ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
              }}
            >
              <AppHeader mode={mode} onToggleMode={toggleMode} />
              <Game />
            </Paper>
          </Container>
        </Box>
      </SoundProvider>
    </ThemeProvider>
  );
}
