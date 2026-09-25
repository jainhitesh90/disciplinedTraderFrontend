import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
  },
  error: {
    marginBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  list: {
    paddingBottom: 32,
  },
  cardTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  field: {
    gap: 4,
  },
  fieldValue: {
    fontWeight: '600',
  },
});

export type ProfileScreenStyles = typeof styles;
