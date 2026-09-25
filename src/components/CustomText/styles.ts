import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  success: {
    fontSize: 14,
    fontWeight: '600',
  },
  danger: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export type CustomTextStyles = typeof styles;
