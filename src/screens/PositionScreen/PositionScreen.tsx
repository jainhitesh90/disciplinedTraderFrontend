import { CustomText, Screen } from '@/components';
import { styles } from '@/screens/PositionScreen/styles';

export function PositionScreen() {
  return (
    <Screen style={styles.container}>
      <CustomText id="position-title" variant="large" style={styles.title}>
        Position
      </CustomText>
    </Screen>
  );
}
