import theme from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Order } from '@/types';

dayjs.extend(relativeTime);

type OrderListItemProps = {
  order: Order;
};

const statusColor: Record<string, string> = {
  New: theme.colors.warning,
  Cooking: theme.colors.primary,
  Delivering: '#3B82F6',
  Delivered: theme.colors.success,
};

const OrderListItem = ({ order }: OrderListItemProps) => {
  const { isAdmin } = useAuth();
  const href = isAdmin
    ? `/(admin)/orders/${order.id}`
    : `/(user)/orders/${order.id}`;

  const itemCount =
    order.order_items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.title}>Order #{order.id}</Text>
          <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
          {itemCount > 0 ? (
            <Text style={styles.items}>{itemCount} item(s)</Text>
          ) : null}
        </View>
        <View style={styles.right}>
          <Text style={styles.total}>${order.total.toFixed(2)}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: (statusColor[order.status] ?? theme.colors.muted) + '22' },
            ]}
          >
            <Text
              style={[
                styles.status,
                { color: statusColor[order.status] ?? theme.colors.textMuted },
              ]}
            >
              {order.status}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadow.card,
  },
  left: { flex: 1 },
  right: { alignItems: 'flex-end' },
  title: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  time: { fontSize: 13, color: theme.colors.textMuted, marginTop: 4 },
  items: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },
  total: { fontSize: 18, fontWeight: '700', color: theme.colors.primary },
  badge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  status: { fontSize: 12, fontWeight: '600' },
});

export default OrderListItem;
