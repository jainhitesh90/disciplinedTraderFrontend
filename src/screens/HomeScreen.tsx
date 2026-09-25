import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CustomButton, CustomText } from '@/components';
import { useTheme } from '@/theme';

export function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText id="home-title" variant="large" style={styles.title}>
        Disciplined Trading
      </CustomText>
      <CustomButton
        id="home-profile"
        label="Profile"
        variant="link"
        onPress={() => router.push('/profile')}
      />
      <CustomButton
        id="home-dashboard"
        label="Dashboard"
        variant="link"
        onPress={() => router.push('/dashboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
});
