import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { ApiError, api, endpoints } from '@/api';

type Order = {
  groww_order_id: string;
  trading_symbol: string;
  order_status: string;
  quantity: number;
  filled_quantity: number;
  average_fill_price: number;
  exchange: string;
  order_type: string;
  transaction_type: string;
  product: string;
  created_at: string;
};

type OrdersResponse = {
  brokerId?: string;
  status?: string;
  payload?: {
    order_list?: Order[];
  };
};

export function DashboardScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<OrdersResponse>(endpoints.orders, {
        query: { segment: 'FNO', page: 0, page_size: 100 },
        headers: { Accept: '*/*' },
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        setStatus(data.status ?? null);
        setOrders(data.payload?.order_list ?? []);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>
        F&O orders{status ? ` · ${status}` : ''}
      </Text>
      {loading ? <ActivityIndicator color="#F8FAFC" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && orders.length === 0 ? (
        <Text style={styles.empty}>No orders</Text>
      ) : null}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.groww_order_id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <OrderRow order={item} />}
      />
    </View>
  );
}

function OrderRow({ order }: { order: Order }) {
  const sideColor = order.transaction_type === 'BUY' ? '#4ADE80' : '#F87171';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.symbol}>{order.trading_symbol}</Text>
        <Text style={[styles.side, { color: sideColor }]}>{order.transaction_type}</Text>
      </View>
      <Text style={styles.meta}>
        {order.order_status} · {order.order_type} · {order.exchange} · {order.product}
      </Text>
      <Text style={styles.meta}>
        Qty {order.filled_quantity}/{order.quantity} · Avg {formatPrice(order.average_fill_price)}
      </Text>
      <Text style={styles.time}>{order.created_at}</Text>
    </View>
  );
}

function formatPrice(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '—';
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
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  symbol: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  side: {
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  time: {
    fontSize: 12,
    color: '#64748B',
  },
});
