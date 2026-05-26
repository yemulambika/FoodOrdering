import { useOrderDetails } from '@/api/orders';
import { useUpdateOrderSubscription } from '@/api/orders/subscriptions';
import OrderItemListItem from '@/components/OrderItemListItem';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import dayjs from 'dayjs';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const rawId = Array.isArray(idString) ? idString[0] : idString;
  const id = Number(rawId);
  const isValidId = Number.isFinite(id) && id > 0;

  const { data: order, isLoading, error } = useOrderDetails(id);
  useUpdateOrderSubscription(id);

  if (isLoading) {
    return <LoadingState message="Loading order..." />;
  }
  if (!isValidId) {
    return <Text style={styles.error}>Invalid order id</Text>;
  }
  if (error || !order) {
    return <Text style={styles.error}>Failed to load order</Text>;
  }

  return (
    <View style={styles.wrap}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <View style={styles.summary}>
        <Text style={styles.status}>{order.status}</Text>
        <Text style={styles.total}>${order.total.toFixed(2)}</Text>
        <Text style={styles.date}>
          {dayjs(order.created_at).format('MMM D, YYYY h:mm A')}
        </Text>
      </View>

      <Text style={styles.section}>Items</Text>
      <FlatList
        data={order.order_items ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.muted}>No line items recorded.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.background },
  summary: {
    backgroundColor: theme.colors.card,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    ...theme.shadow.card,
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  total: { fontSize: 28, fontWeight: '800', color: theme.colors.text, marginTop: 8 },
  date: { color: theme.colors.textMuted, marginTop: 4 },
  section: {
    paddingHorizontal: theme.spacing.md,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  list: { gap: 10, paddingHorizontal: theme.spacing.md, paddingBottom: 32 },
  error: { padding: theme.spacing.md, color: theme.colors.error },
  muted: { color: theme.colors.textMuted, padding: theme.spacing.md },
});
