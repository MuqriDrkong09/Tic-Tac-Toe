import { createTheme, type PaletteMode, type Theme } from "@mui/material/styles";

/**
 * Builds an MUI theme for the given color mode.
 *
 * Dark mode tweaks:
 *  - Lighter blue / pink primaries (better contrast on dark surfaces).
 *  - Deep navy `background.default`, slightly elevated `background.paper`.
 *  - `success`/`warning` lights are dialed up so the StatusBar banners
 *    stay legible on dark backgrounds.
 */
export const createAppTheme = (mode: PaletteMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary:
        mode === "light"
          ? { main: "#1976d2", light: "#42a5f5", dark: "#1565c0" }
          : { main: "#64b5f6", light: "#90caf9", dark: "#1e88e5" },
      secondary:
        mode === "light"
          ? { main: "#e91e63", light: "#f06292", dark: "#c2185b" }
          : { main: "#f48fb1", light: "#f8bbd0", dark: "#ec407a" },
      background:
        mode === "light"
          ? { default: "#f4f6f8", paper: "#ffffff" }
          : { default: "#0f1419", paper: "#1a2027" },
      success:
        mode === "light"
          ? { main: "#2e7d32", light: "#c8e6c9", dark: "#1b5e20" }
          : { main: "#66bb6a", light: "#2e4c30", dark: "#a5d6a7" },
      warning:
        mode === "light"
          ? { main: "#ed6c02", light: "#fff4e5", dark: "#c25400" }
          : { main: "#ffa726", light: "#4a2e0e", dark: "#ffb74d" },
    },
    typography: {
      fontFamily: [
        "Roboto",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),
      h1: { fontWeight: 700, fontSize: "2.5rem" },
      h2: { fontWeight: 700, fontSize: "2rem" },
      h3: { fontWeight: 600, fontSize: "1.5rem" },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

const theme = createAppTheme("light");
export default theme;
