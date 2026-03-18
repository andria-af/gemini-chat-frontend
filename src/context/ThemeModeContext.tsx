import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

interface ThemeModeContextData {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextData | null>(null);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }

  return context;
}