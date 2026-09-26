import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 4,
    minHeight: 32,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusMessage: {
    flex: 1,
    fontSize: 13,
  },
  statusAction: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export type HomeScreenStyles = typeof styles;
