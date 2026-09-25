import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mobileWrap: {
    width: '100%',
    paddingHorizontal: 0,
  },
  mobileBar: {
    width: '100%',
    margin: 0,
    borderRadius: 0,
  },
  desktopWrap: {
    width: '100%',
    alignItems: 'flex-start',
  },
  desktopBar: {
    width: 420,
    maxWidth: '100%',
    marginLeft: 16,
    marginRight: 0,
    borderRadius: 12,
  },
});

export type AppSnackbarStyles = typeof styles;
