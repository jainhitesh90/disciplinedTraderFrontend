import { Linking, Platform } from 'react-native';

export function openInBrowser(url: string): void {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return;
    }
    const opened = window.open(url, '_blank');
    if (opened) {
      opened.opener = null;
      return;
    }
    window.location.assign(url);
    return;
  }

  void Linking.openURL(url);
}
