import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

import { styles } from '@/components/AppModal/styles';
import { CustomText } from '@/components/CustomText';
import { useTheme } from '@/theme';

type AppModalProps = {
  visible: boolean;
  title: string;
  onDismiss: () => void;
  children: ReactNode;
};

export function AppModal({ visible, title, onDismiss, children }: AppModalProps) {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.position}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <CustomText id="app-modal-title" variant="medium">
            {title}
          </CustomText>
          {children}
        </View>
      </Modal>
    </Portal>
  );
}
