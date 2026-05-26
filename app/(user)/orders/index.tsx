import { useMyOrderList } from '@/api/orders';
import OrderListItem from '@/components/OrderListItem';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, error, refetch, isRefetching } = useMyOrderList();

  if (isLoading) {
    return <LoadingState message="Loading your orders..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="exclamation-circle"
        title="Could not load orders"
        message={(error as Error).message}
        actionLabel="Try again"
        onAction={() => refetch()}
      />
    );
  }

  const list = orders ?? [];

  if (!list.length) {
    return (
      <EmptyState
        icon="shopping-bag"
        title="No orders yet"
        message="Browse restaurants, add items to cart, and checkout to see orders here."
        actionLabel="Browse food"
        onAction={() => router.push('/(user)/home')}
      />
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Your orders</Text>
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    color: theme.colors.text,
  },
  list: { gap: 12, padding: theme.spacing.md, paddingBottom: 32 },
});
