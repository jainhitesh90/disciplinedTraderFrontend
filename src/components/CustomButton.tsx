import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { CustomText } from '@/components/CustomText';
import { useTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'link';

type CustomButtonProps = Omit<PressableProps, 'id' | 'style' | 'children'> & {
  id: string;
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function CustomButton({
  id,
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  accessibilityLabel,
  ...rest
}: CustomButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={id}
      nativeID={id}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        variant === 'primary' ? styles.primary : styles.link,
        variant === 'primary' ? { backgroundColor: colors.primary } : null,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <CustomText
          id={`${id}-label`}
          variant={variant === 'primary' ? 'body' : 'link'}
          style={variant === 'primary' ? [styles.primaryLabel, { color: colors.onPrimary }] : undefined}
        >
          {label}
        </CustomText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  primaryLabel: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
