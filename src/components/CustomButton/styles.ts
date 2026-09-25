import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  primary: {
    borderRadius: 12,
  },
  link: {
    borderRadius: 12,
  },
  primaryContent: {
    paddingVertical: 8,
  },
  linkContent: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export type CustomButtonStyles = typeof styles;
