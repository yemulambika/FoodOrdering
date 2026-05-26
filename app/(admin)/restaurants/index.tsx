import { useRestaurantList } from '@/api/restaurants';
import RestaurantListItem from '@/components/RestaurantListItem';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import { Stack } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function AdminRestaurantsScreen() {
  const { data: restaurants, isLoading, error, refetch, isRefetching } =
    useRestaurantList();

  if (isLoading) {
    return <LoadingState message="Loading restaurants..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="exclamation-circle"
        title="Could not load restaurants"
        message={(error as Error).message}
        actionLabel="Retry"
        onAction={() => refetch()}
      />
    );
  }

  const list = restaurants ?? [];

  return (
    <View style={styles.wrap}>
      <Stack.Screen options={{ title: 'Restaurants' }} />
      <Text style={styles.heading}>Restaurants</Text>
      <Text style={styles.sub}>
        Browse partner restaurants. Menu items are managed under Products.
      </Text>
      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RestaurantListItem restaurant={item} adminPreview />
        )}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <EmptyState
            icon="building"
            title="No restaurants"
            message="Run supabase/setup_database.sql to seed restaurants."
          />
        }
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
  sub: {
    color: theme.colors.textMuted,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: 14,
  },
  list: { padding: theme.spacing.md, paddingBottom: 32 },
});
