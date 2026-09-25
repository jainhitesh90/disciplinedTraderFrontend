import type { TextProps, TextStyle } from 'react-native';
import { Text, type TextProps as PaperTextProps } from 'react-native-paper';

import { styles } from '@/components/CustomText/styles';
import { useTheme } from '@/theme';

export type TextVariant =
  | 'large'
  | 'medium'
  | 'body'
  | 'small'
  | 'caption'
  | 'label'
  | 'error'
  | 'link'
  | 'success'
  | 'danger';

type CustomTextProps = TextProps & {
  id: string;
  variant?: TextVariant;
};

const paperVariant: Record<TextVariant, PaperTextProps<never>['variant']> = {
  large: 'headlineMedium',
  medium: 'titleMedium',
  body: 'bodyLarge',
  small: 'bodyMedium',
  caption: 'bodySmall',
  label: 'labelLarge',
  error: 'bodyMedium',
  link: 'bodyLarge',
  success: 'labelLarge',
  danger: 'labelLarge',
};

export function CustomText({ id, variant = 'body', style, children, ...rest }: CustomTextProps) {
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
    success: colors.success,
    danger: colors.danger,
  };

  return (
    <Text
      testID={id}
      nativeID={id}
      variant={paperVariant[variant]}
      style={[styles[variant], { color: variantColor[variant] }, style as TextStyle]}
      {...rest}
    >
      {children}
    </Text>
  );
}
