import { CustomText, Screen } from '@/components';
import { styles } from '@/screens/RulesScreen/styles';

export function RulesScreen() {
  return (
    <Screen style={styles.container}>
      <CustomText id="rules-title" variant="large" style={styles.title}>
        Rules
      </CustomText>
    </Screen>
  );
}
