export type ThemeName = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  textSecondary: string;
  textDim: string;
  primary: string;
  onPrimary: string;
  link: string;
  error: string;
  danger: string;
  success: string;
  chip: string;
};

// Groww brand green (#00B386) with the light and dark surfaces used in the Groww app.
export const themes: Record<ThemeName, ThemeColors> = {
  light: {
    background: '#F6F6F7',
    surface: '#FFFFFF',
    border: '#E8E8EA',
    text: '#44475B',
    textMuted: '#7C7E8C',
    textSecondary: '#5E616E',
    textDim: '#A1A3AB',
    primary: '#00B386',
    onPrimary: '#FFFFFF',
    link: '#00B386',
    error: '#EB5B3C',
    danger: '#EB5B3C',
    success: '#00B386',
    chip: '#44475B',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    border: '#2C2C2E',
    text: '#FFFFFF',
    textMuted: '#9E9E9E',
    textSecondary: '#D1D1D1',
    textDim: '#757575',
    primary: '#00B386',
    onPrimary: '#FFFFFF',
    link: '#00D09C',
    error: '#FF8A75',
    danger: '#EB5B3C',
    success: '#00B386',
    chip: '#FFFFFF',
  },
};

export const DEFAULT_THEME: ThemeName = 'dark';

export const colors = themes[DEFAULT_THEME];
