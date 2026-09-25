import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  content: {
    gap: 12,
  },
});

export type CardStyles = typeof styles;
