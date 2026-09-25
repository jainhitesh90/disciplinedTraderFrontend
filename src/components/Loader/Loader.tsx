import { ActivityIndicator } from 'react-native-paper';

import { useTheme } from '@/theme';

export function Loader() {
  const { colors } = useTheme();
  return <ActivityIndicator animating color={colors.text} />;
}
