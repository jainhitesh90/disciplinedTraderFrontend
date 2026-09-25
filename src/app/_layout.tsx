import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DialogProvider } from '@/components/AppDialog';
import { ToastProvider } from '@/components/AppToast';
import { ThemeProvider, useTheme } from '@/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DialogProvider>
          <RootNavigator />
        </DialogProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}
