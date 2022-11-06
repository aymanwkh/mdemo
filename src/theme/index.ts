import { createTheme as createMuiTheme } from '@mui/material/styles';
import { createThemeComponents } from "./components";
import mixins from "./mixins";
import { darkPalette, lightPalette } from "./palette";
import shape from "./shape";
import transitions from "./transitions";
import typography from "./typography";
import { arSD, enUS } from '@mui/material/locale';

export const createTheme = (
  direction: "ltr" | "rtl",
  mode: "dark" | "light"
) => {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  const locale = direction === 'ltr' ? enUS : arSD
  // Create base theme
  const baseTheme = createMuiTheme({
    direction,
    mixins,
    palette,
    shape,
    transitions,
    typography,
  }, locale);

  // Inject base theme to be used in components
  return createMuiTheme(
    {
      components: createThemeComponents(baseTheme),
    },
    baseTheme
  );
};
