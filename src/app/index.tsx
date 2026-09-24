import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>Disciplined Trading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1220',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#94A3B8',
  },
});
