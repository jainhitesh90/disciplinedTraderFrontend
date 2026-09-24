import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApiError, api, endpoints } from '@/api';

type UserPayload = {
  vendor_user_id?: string;
  ucc?: string;
  nse_enabled?: boolean;
  bse_enabled?: boolean;
  ddpi_enabled?: boolean;
  active_segments?: string[];
};

type UserResponse = {
  brokerId?: string;
  status?: string;
  payload?: UserPayload;
};

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<UserResponse>(endpoints.user)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
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

  const payload = profile?.payload;
  const segments = payload?.active_segments ?? [];
  const broker = profile?.brokerId ? titleCase(profile.brokerId) : 'Account';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        {broker}
        {profile?.status ? ` · ${profile.status}` : ''}
      </Text>
      {loading ? <ActivityIndicator color="#F8FAFC" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && !payload ? <Text style={styles.empty}>No profile</Text> : null}
      {payload ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>
            <Field label="UCC" value={payload.ucc ?? '—'} />
            <Field label="Vendor user ID" value={payload.vendor_user_id ?? '—'} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Access</Text>
            <Flag label="NSE" enabled={payload.nse_enabled} />
            <Flag label="BSE" enabled={payload.bse_enabled} />
            <Flag label="DDPI" enabled={payload.ddpi_enabled} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Segments</Text>
            {segments.length === 0 ? <Text style={styles.empty}>None</Text> : null}
            <View style={styles.chips}>
              {segments.map((segment) => (
                <View key={segment} style={styles.chip}>
                  <Text style={styles.chipText}>{segment}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function Flag({ label, enabled }: { label: string; enabled?: boolean }) {
  const on = enabled === true;
  return (
    <View style={styles.row}>
      <Text style={styles.fieldValue}>{label}</Text>
      <Text style={[styles.flag, { color: on ? '#4ADE80' : '#F87171' }]}>{on ? 'Enabled' : 'Off'}</Text>
    </View>
  );
}

function titleCase(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 16,
    color: '#94A3B8',
  },
  error: {
    marginBottom: 12,
    fontSize: 16,
    color: '#FCA5A5',
  },
  empty: {
    fontSize: 16,
    color: '#94A3B8',
  },
  scroll: {
    flex: 1,
  },
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 14,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1E293B',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
});
