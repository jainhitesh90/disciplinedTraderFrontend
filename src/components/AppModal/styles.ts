import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  position: {
    marginHorizontal: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
});

export type AppModalStyles = typeof styles;
