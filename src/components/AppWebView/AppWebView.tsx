import { Platform, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { WebView } from 'react-native-webview';

import { styles } from '@/components/AppWebView/styles';
import { CustomButton } from '@/components/CustomButton';
import { CustomText } from '@/components/CustomText';
import { useTheme } from '@/theme';

type AppWebViewProps = {
  visible: boolean;
  url: string;
  title: string;
  onDismiss: () => void;
};

export function openInBrowser(url: string): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const opened = window.open(url, '_blank');
  if (opened) {
    opened.opener = null;
    return true;
  }

  window.location.assign(url);
  return true;
}

export function AppWebView({ visible, url, title, onDismiss }: AppWebViewProps) {
  const { colors } = useTheme();

  if (!visible || !url) {
    return null;
  }

  return (
    <Portal>
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <CustomText id="webview-title" variant="medium" style={styles.title}>
            {title}
          </CustomText>
          <CustomButton id="webview-close" label="Close" variant="link" onPress={onDismiss} />
        </View>
        <WebView source={{ uri: url }} style={styles.web} />
      </View>
    </Portal>
  );
}
