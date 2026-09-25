import { useEffect, useState } from 'react';
import { Image, Pressable, View, type ImageSourcePropType } from 'react-native';

import { ApiError, api, endpoints } from '@/api';
import { openInBrowser } from '@/browser/openInBrowser';
import { CustomText } from '@/components/CustomText';
import { GrowwConnectModal } from '@/components/GrowwConnectModal';
import { Loader } from '@/components/Loader';
import { Screen } from '@/components/Screen';
import { styles } from '@/screens/ConnectBrokerScreen/styles';
import { useTheme } from '@/theme';

type Broker = {
  brokerId: string;
  brokerName: string;
  brokerLinkUrl: string;
};

type BrokerMapping = {
  brokerStatus: string;
};

type User = {
  brokerMapping: BrokerMapping | null;
};

const brokerLogos: Record<string, ImageSourcePropType> = {
  groww: require('../../../assets/images/groww.png'),
  upstox: require('../../../assets/images/upstox.jpeg'),
};

export function ConnectBrokerScreen() {
  const { colors } = useTheme();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [growwBroker, setGrowwBroker] = useState<Broker | null>(null);
  const [brokerMapping, setBrokerMapping] = useState<BrokerMapping | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get<Broker[]>(endpoints.brokers)
      .then((data) => {
        if (!cancelled) {
          setBrokers(Array.isArray(data) ? data : []);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        if (err instanceof ApiError) {
          setError(err.message);
          return;
        }
        setError(err instanceof Error ? err.message : 'Request failed');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    api
      .get<User>(endpoints.user)
      .then((data) => {
        if (!cancelled) {
          setBrokerMapping(data.brokerMapping ?? null);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen style={styles.container}>
      <CustomText id="connect-broker-title" variant="large" style={styles.title}>
        Connect to broker
      </CustomText>
      {loading ? <Loader /> : null}
      {error ? (
        <CustomText id="connect-broker-error" variant="error" style={styles.error}>
          {error}
        </CustomText>
      ) : null}
      {!loading && !error && brokers.length === 0 ? (
        <CustomText id="connect-broker-empty" variant="small">
          No brokers
        </CustomText>
      ) : null}
      <View style={styles.grid}>
        {brokers.map((broker) => {
          const logo = brokerLogos[broker.brokerName.trim().toLowerCase()];
          return (
            <Pressable
              key={broker.brokerId}
              accessibilityRole="button"
              accessibilityLabel={broker.brokerName}
              onPress={() => {
                if (broker.brokerName.trim().toLowerCase() === 'groww') {
                  setGrowwBroker(broker);
                  return;
                }
                if (broker.brokerLinkUrl) {
                  openInBrowser(broker.brokerLinkUrl);
                }
              }}
              style={[styles.cell, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              {logo ? (
                <Image accessibilityLabel={broker.brokerName} source={logo} style={styles.logo} />
              ) : null}
              <CustomText id={`broker-${broker.brokerId}-name`} variant="label">
                {broker.brokerName}
              </CustomText>
            </Pressable>
          );
        })}
      </View>
      <GrowwConnectModal
        visible={growwBroker != null}
        brokerLinkUrl={growwBroker?.brokerLinkUrl ?? ''}
        brokerMapping={brokerMapping}
        onDismiss={() => setGrowwBroker(null)}
      />
    </Screen>
  );
}
