import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { styles } from '@/components/Screen/styles';
import { useTheme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { colors } = useTheme();

  return <View style={[styles.screen, { backgroundColor: colors.background }, style]}>{children}</View>;
}
