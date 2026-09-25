import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';

import { DEFAULT_THEME, themes, type ThemeColors, type ThemeName } from '@/theme/colors';
import { createPaperTheme } from '@/theme/paperTheme';

type ThemeContextValue = {
  theme: ThemeName;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);
  const paperTheme = useMemo(() => createPaperTheme(theme), [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: themes[theme],
      isDark: theme === 'dark',
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
