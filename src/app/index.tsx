import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disciplined Trading</Text>
      <Link href="/profile" style={styles.link}>
        Profile
      </Link>
      <Link href="/dashboard" style={styles.link}>
        Dashboard
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B1220',
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  link: {
    fontSize: 18,
    fontWeight: '600',
    color: '#93C5FD',
  },
});
