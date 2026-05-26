import { useAdminOrderList } from '@/api/orders';
import { useInsertOrderSubscription } from '@/api/orders/subscriptions';
import OrderListItem from '@/components/OrderListItem';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function AdminOrdersScreen() {
  const { data: orders, isLoading, error, refetch, isRefetching } =
    useAdminOrderList({ archived: false });

  useInsertOrderSubscription();

  if (isLoading) {
    return <LoadingState message="Loading orders..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="exclamation-circle"
        title="Failed to load orders"
        message={(error as Error).message}
        actionLabel="Retry"
        onAction={() => refetch()}
      />
    );
  }

  const list = orders ?? [];

  if (!list.length) {
    return (
      <EmptyState
        icon="inbox"
        title="No active orders"
        message="New customer orders will appear here."
      />
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Active orders</Text>
      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.colors.background },
  heading: {
    ...theme.typography.title,
    padding: theme.spacing.md,
    color: theme.colors.text,
  },
  list: { gap: 12, paddingHorizontal: theme.spacing.md, paddingBottom: 32 },
});
