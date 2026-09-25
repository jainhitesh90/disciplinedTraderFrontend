import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  subtitle: {
    marginTop: -8,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 15,
  },
  switchLink: {
    fontSize: 15,
  },
});

export type AuthScreenStyles = typeof styles;
