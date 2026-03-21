import { createTheme } from "@mui/material/styles";

export const appBackgrounds = {
  light: `
    radial-gradient(circle at top, rgba(148,163,184,0.18), transparent 35%),
    linear-gradient(135deg, #f5f7fb 0%, #edf1f7 45%, #e9eef5 100%)
  `,
  dark: `
    radial-gradient(circle at top, rgba(120,130,160,0.18), transparent 35%),
    linear-gradient(135deg, #0f1115 0%, #171a21 45%, #111318 100%)
  `,
};

export const appShadows = {
  lightCard: "0 20px 50px rgba(15,23,42,0.08)",
  darkCard: "0 20px 50px rgba(0,0,0,0.35)",
  lightRobot: "drop-shadow(0 10px 20px rgba(15,23,42,0.18))",
  darkRobot: "drop-shadow(0 10px 24px rgba(0,0,0,0.45))",
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      dark: "#115293",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    divider: "rgba(15,23,42,0.12)",
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      dark: "#5d99c6",
      contrastText: "#0b1220",
    },
    secondary: {
      main: "#ce93d8",
    },
    background: {
      default: "#111318",
      paper: "#171a21",
    },
    divider: "rgba(255,255,255,0.12)",
    text: {
      primary: "#f3f4f6",
      secondary: "#a1a1aa",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});
