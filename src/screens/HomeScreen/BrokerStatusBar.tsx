import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { ApiError, api, endpoints } from '@/api';
import { useToast } from '@/components';
import { BrokerStatus } from '@/screens/HomeScreen/BrokerStatus';

type BrokerConnection = 'CONNECTED' | 'DISCONNECTED';

type BrokerMapping = {
  brokerId: string;
  brokerStatus: BrokerConnection;
};

type User = {
  brokerMapping: BrokerMapping | null;
};

type BrokerNotice = 'warning' | 'connected';

const CONNECTED_NOTICE_MS = 2000;

export function BrokerStatusBar() {
  const toast = useToast();
  const [notice, setNotice] = useState<BrokerNotice | null>(null);
  const [brokerName, setBrokerName] = useState('');

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

  useEffect(() => {
    if (notice !== 'connected') {
      return;
    }
    const timeout = setTimeout(() => setNotice(null), CONNECTED_NOTICE_MS);
    return () => clearTimeout(timeout);
  }, [notice]);

  if (!notice) {
    return null;
  }

  const connected = notice === 'connected';

  return (
    <BrokerStatus
      connected={connected}
      message={connected ? `Connected to ${brokerLabel(brokerName)}` : 'No broker connected'}
      actionLabel={connected ? undefined : 'Connect'}
      onAction={connected ? undefined : () => router.push('/connect-broker')}
    />
  );
}

function brokerLabel(brokerId: string): string {
  const name = brokerId.trim();
  if (!name) {
    return 'your broker';
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}
