import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './theme/theme';

function Root() {
  const [darkMode] = useState(false);

  const theme = useMemo(() => {
    return darkMode ? darkTheme : lightTheme;
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);