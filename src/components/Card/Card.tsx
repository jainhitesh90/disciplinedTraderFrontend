import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

import { styles } from '@/components/Card/styles';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  return (
    <PaperCard mode="contained" style={[styles.card, style]}>
      <PaperCard.Content style={styles.content}>{children}</PaperCard.Content>
    </PaperCard>
  );
}
