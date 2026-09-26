import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
});

export type AppTabBarStyles = typeof styles;
