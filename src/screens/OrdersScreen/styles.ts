import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
  },
  error: {
    marginBottom: 12,
  },
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  orderCard: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  symbol: {
    flex: 1,
    fontWeight: '600',
  },
});

export type OrdersScreenStyles = typeof styles;
