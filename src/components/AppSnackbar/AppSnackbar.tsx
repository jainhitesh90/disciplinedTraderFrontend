import { useWindowDimensions } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';

import { styles } from '@/components/AppSnackbar/styles';
import { CustomText } from '@/components/CustomText';
import { useTheme } from '@/theme';

const DESKTOP_WIDTH = 768;

type SnackbarVariant = 'warning' | 'positive';

type AppSnackbarProps = {
  visible: boolean;
  message: string;
  variant?: SnackbarVariant;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function AppSnackbar({
  visible,
  message,
  variant = 'warning',
  actionLabel,
  onAction,
  onDismiss,
}: AppSnackbarProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const desktop = width >= DESKTOP_WIDTH;
  const positive = variant === 'positive';
  const backgroundColor = positive ? colors.success : colors.warning;
  const textColor = positive ? colors.onPrimary : colors.onWarning;

  return (
    <Portal>
      <Snackbar
        visible={visible}
        duration={positive ? 2000 : Number.POSITIVE_INFINITY}
        onDismiss={onDismiss ?? (() => {})}
        wrapperStyle={desktop ? styles.desktopWrap : styles.mobileWrap}
        style={[desktop ? styles.desktopBar : styles.mobileBar, { backgroundColor }]}
        action={
          actionLabel && onAction
            ? {
                label: actionLabel,
                onPress: onAction,
                textColor: colors.onPrimary,
                buttonColor: colors.primary,
                mode: 'contained',
                compact: true,
                testID: 'snackbar-action',
              }
            : undefined
        }
      >
        <CustomText id={`app-snackbar-${variant}`} variant="body" style={{ color: textColor }}>
          {message}
        </CustomText>
      </Snackbar>
    </Portal>
  );
}
