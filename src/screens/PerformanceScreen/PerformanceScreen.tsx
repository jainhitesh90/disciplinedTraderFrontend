import { CustomText, Screen } from '@/components';
import { styles } from '@/screens/PerformanceScreen/styles';

export function PerformanceScreen() {
  return (
    <Screen style={styles.container}>
      <CustomText id="performance-title" variant="large" style={styles.title}>
        Performance
      </CustomText>
    </Screen>
  );
}
