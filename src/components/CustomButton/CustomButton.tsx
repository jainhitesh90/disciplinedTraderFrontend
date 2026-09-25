import type { StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

import { styles } from '@/components/CustomButton/styles';
import { useTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'link';

type CustomButtonProps = {
  id: string;
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function CustomButton({
  id,
  label,
  variant = 'primary',
  loading = false,
  disabled,
  onPress,
  style,
  accessibilityLabel,
}: CustomButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Button
      testID={id}
      nativeID={id}
      mode={isPrimary ? 'contained' : 'text'}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      uppercase={false}
      buttonColor={isPrimary ? colors.primary : 'transparent'}
      textColor={isPrimary ? colors.onPrimary : colors.link}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[isPrimary ? styles.primary : styles.link, style]}
      contentStyle={isPrimary ? styles.primaryContent : styles.linkContent}
      labelStyle={styles.label}
    >
      {label}
    </Button>
  );
}
