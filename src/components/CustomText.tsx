import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/theme';

export type TextVariant = 'large' | 'medium' | 'body' | 'small' | 'caption' | 'label' | 'error' | 'link';

type CustomTextProps = TextProps & {
  id: string;
  variant?: TextVariant;
};

export function CustomText({ id, variant = 'body', style, ...rest }: CustomTextProps) {
  const { colors } = useTheme();
  const variantColor: Record<TextVariant, string> = {
    large: colors.text,
    medium: colors.text,
    body: colors.text,
    small: colors.textMuted,
    caption: colors.textDim,
    label: colors.textSecondary,
    error: colors.error,
    link: colors.link,
  };

  return (
    <Text
      testID={id}
      nativeID={id}
      style={[variantStyles[variant], { color: variantColor[variant] }, style]}
      {...rest}
    />
  );
}

const variantStyles = StyleSheet.create({
  large: {
    fontSize: 32,
    fontWeight: '700',
  },
  medium: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  small: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    fontSize: 14,
    fontWeight: '400',
  },
  link: {
    fontSize: 16,
    fontWeight: '700',
  },
});
