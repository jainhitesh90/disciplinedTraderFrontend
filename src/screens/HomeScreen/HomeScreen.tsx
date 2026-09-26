import { Screen } from '@/components';
import { BrokerStatusBar } from '@/screens/HomeScreen/BrokerStatusBar';

export function HomeScreen() {
  return (
    <Screen>
      <BrokerStatusBar />
      {/* <View style={styles.container}>
        <CustomButton
          id="home-profile"
          label="Profile"
          variant="link"
          onPress={() => router.push('/profile')}
        />
        <CustomButton
          id="home-dashboard"
          label="Dashboard"
          variant="link"
          onPress={() => router.push('/dashboard')}
        />
      </View> */}
    </Screen>
  );
}
