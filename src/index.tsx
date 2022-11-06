import { createRoot } from 'react-dom/client';
import App from './App';

import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from './theme';

let direction = process.env.REACT_APP_LANG === 'en' ? 'ltr' : 'rtl' as 'rtl' | 'ltr'
const mode = 'light'
document.body.dir = direction;
const theme = createTheme(direction, mode)
const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
if (direction === 'rtl') {
  // Create rtl cache
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  root.render (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  )
} else {
  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>

  )
}