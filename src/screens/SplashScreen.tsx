import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { readAuthSession } from '@/api';
import { useTheme } from '@/theme';

const SPLASH_DURATION_MS = 1000;

export function SplashScreen() {
  const { colors } = useTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const token = readAuthSession()?.token;
      router.replace(token ? '/home' : '/login');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        accessibilityLabel="Disciplined Trading"
        source={require('../../assets/images/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
});
