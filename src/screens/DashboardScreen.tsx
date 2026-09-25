import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { ApiError, api, endpoints } from '@/api';
import { CustomText } from '@/components';
import { useTheme, type ThemeColors } from '@/theme';

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

type OrdersData = {
  status?: string | null;
  payload?: {
    order_list?: Order[];
  };
};

export function DashboardScreen() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get<OrdersData>(endpoints.orders, {
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText id="dashboard-title" variant="large">
        Dashboard
      </CustomText>
      <CustomText id="dashboard-subtitle" variant="body" style={[styles.subtitle, { color: colors.textMuted }]}>
        F&O orders{status ? ` · ${status}` : ''}
      </CustomText>
      {loading ? <ActivityIndicator color={colors.text} /> : null}
      {error ? (
        <CustomText id="dashboard-error" variant="error" style={styles.error}>
          {error}
        </CustomText>
      ) : null}
      {!loading && !error && orders.length === 0 ? (
        <CustomText id="dashboard-empty" variant="body" style={{ color: colors.textMuted }}>
          No orders
        </CustomText>
      ) : null}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.groww_order_id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <OrderRow order={item} colors={colors} />}
      />
    </View>
  );
}

function OrderRow({ order, colors }: { order: Order; colors: ThemeColors }) {
  const sideColor = order.transaction_type === 'BUY' ? colors.success : colors.danger;
  const id = order.groww_order_id;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.row}>
        <CustomText id={`order-${id}-symbol`} variant="body" style={styles.symbol}>
          {order.trading_symbol}
        </CustomText>
        <CustomText id={`order-${id}-side`} variant="label" style={{ color: sideColor }}>
          {order.transaction_type}
        </CustomText>
      </View>
      <CustomText id={`order-${id}-status`} variant="small" style={{ color: colors.textSecondary }}>
        {order.order_status} · {order.order_type} · {order.exchange} · {order.product}
      </CustomText>
      <CustomText id={`order-${id}-qty`} variant="small" style={{ color: colors.textSecondary }}>
        Qty {order.filled_quantity}/{order.quantity} · Avg {formatPrice(order.average_fill_price)}
      </CustomText>
      <CustomText id={`order-${id}-time`} variant="caption">
        {order.created_at}
      </CustomText>
    </View>
  );
}

function formatPrice(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '—';
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
  list: {
    gap: 12,
    paddingBottom: 32,
  },
  card: {
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
    fontWeight: '600',
  },
});
