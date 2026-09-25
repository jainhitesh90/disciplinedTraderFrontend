import { router, useFocusEffect, usePathname } from 'expo-router';
import { useCallback, useState } from 'react';

import { ApiError, api, endpoints } from '@/api';
import { AppSnackbar, CustomButton, CustomText, Screen, useToast } from '@/components';
import { styles } from '@/screens/HomeScreen/styles';

type BrokerStatus = 'CONNECTED' | 'DISCONNECTED';

type BrokerMapping = {
  brokerId: string;
  brokerStatus: BrokerStatus;
};

type User = {
  brokerMapping: BrokerMapping | null;
};

type BrokerNotice = 'warning' | 'connected';

export function HomeScreen() {
  const toast = useToast();
  const pathname = usePathname();
  const [notice, setNotice] = useState<BrokerNotice | null>(null);
  const [brokerName, setBrokerName] = useState('');
  const onHome = pathname === '/home';

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setNotice(null);

      api
        .get<User>(endpoints.user)
        .then((data) => {
          if (cancelled) {
            return;
          }
          const mapping = data.brokerMapping;
          if (!mapping || mapping.brokerStatus === 'DISCONNECTED') {
            setNotice('warning');
            return;
          }
          if (mapping.brokerStatus === 'CONNECTED') {
            setBrokerName(mapping.brokerId);
            setNotice('connected');
          }
        })
        .catch((err: unknown) => {
          if (cancelled) {
            return;
          }
          if (err instanceof ApiError) {
            toast.show(err.message);
            return;
          }
          toast.show(err instanceof Error ? err.message : 'Request failed');
        });

      return () => {
        cancelled = true;
      };
    }, [toast]),
  );

  return (
    <Screen style={styles.container}>
      <CustomText id="home-title" variant="large" style={styles.title}>
        Disciplined Trading
      </CustomText>
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
      <AppSnackbar
        visible={notice === 'warning' && onHome}
        message="No broker connected"
        actionLabel="Connect"
        onAction={() => router.push('/connect-broker')}
      />
      <AppSnackbar
        visible={notice === 'connected' && onHome}
        variant="positive"
        message={`Connected to ${brokerLabel(brokerName)}`}
        onDismiss={() => setNotice(null)}
      />
    </Screen>
  );
}

function brokerLabel(brokerId: string): string {
  const name = brokerId.trim();
  if (!name) {
    return 'your broker';
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}
