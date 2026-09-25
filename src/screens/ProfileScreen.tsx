import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ApiError, api, endpoints } from '@/api';
import { CustomText } from '@/components';
import { useTheme } from '@/theme';

type User = {
  userId?: string;
  name: string | null;
  emailId: string | null;
  phoneNo: string | null;
  brokerMapping: { brokerId: string; brokerToken: string } | null;
};

export function ProfileScreen() {
  const { colors } = useTheme();
  const [account, setAccount] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<User>(endpoints.user)
      .then((data) => {
        if (!cancelled) {
          setAccount(data);
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

    return () => {
      cancelled = true;
    };
  }, []);

  const subtitle = account?.name || account?.emailId || 'Account';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText id="profile-title" variant="large">
        Profile
      </CustomText>
      <CustomText id="profile-subtitle" variant="body" style={[styles.subtitle, { color: colors.textMuted }]}>
        {subtitle}
      </CustomText>
      {loading ? <ActivityIndicator color={colors.text} /> : null}
      {error ? (
        <CustomText id="profile-error" variant="error" style={styles.error}>
          {error}
        </CustomText>
      ) : null}
      {!loading && !error && !account ? (
        <CustomText id="profile-empty" variant="body" style={{ color: colors.textMuted }}>
          No profile
        </CustomText>
      ) : null}
      {account ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <CustomText id="profile-account-title" variant="label" style={[styles.cardTitle, { color: colors.textMuted }]}>
              Account
            </CustomText>
            <Field id="profile-name" label="Name" value={displayValue(account.name)} />
            <Field id="profile-email" label="Email" value={displayValue(account.emailId)} />
            <Field id="profile-phone" label="Phone" value={displayValue(account.phoneNo)} />
            <Field id="profile-broker-id" label="Broker ID" value={displayValue(account.brokerMapping?.brokerId)} />
            <Field id="profile-broker-token" label="Broker token" value={displayValue(account.brokerMapping?.brokerToken)} />
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

function Field({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <View style={styles.field}>
      <CustomText id={`${id}-label`} variant="caption">
        {label}
      </CustomText>
      <CustomText id={`${id}-value`} variant="body" style={styles.fieldValue}>
        {value}
      </CustomText>
    </View>
  );
}

function displayValue(value: string | null | undefined): string {
  return value?.trim() ? value : '—';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
  },
  error: {
    marginBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  field: {
    gap: 4,
  },
  fieldValue: {
    fontWeight: '600',
  },
});
