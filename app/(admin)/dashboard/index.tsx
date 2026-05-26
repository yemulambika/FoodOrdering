import { useAdminDashboardStats } from '@/api/orders';
import { useRestaurantList } from '@/api/restaurants';
import Button from '@/components/Button';
import StatCard from '@/components/ui/StatCard';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { data: stats, isLoading, refetch } = useAdminDashboardStats();
  const { data: restaurants } = useRestaurantList();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Admin Dashboard</Text>
      <Text style={styles.sub}>Overview of your food ordering platform</Text>

      <View style={styles.statsRow}>
        <StatCard
          label="Total orders"
          value={String(stats?.totalOrders ?? 0)}
          icon="list-alt"
        />
        <StatCard
          label="Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(0)}`}
          icon="dollar"
          accent={theme.colors.success}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          label="Pending"
          value={String(stats?.pendingOrders ?? 0)}
          icon="clock-o"
          accent={theme.colors.warning}
        />
        <StatCard
          label="Products"
          value={String(stats?.productsCount ?? 0)}
          icon="cutlery"
        />
      </View>

      <Text style={styles.section}>Quick actions</Text>
      <Button
        text="Manage products"
        onPress={() => router.push('/(admin)/menu')}
      />
      <Button
        text="View orders"
        variant="outline"
        onPress={() => router.push('/(admin)/orders/list')}
      />
      <Button
        text="Manage restaurants"
        variant="outline"
        onPress={() => router.push('/(admin)/restaurants')}
      />

      <Text style={styles.section}>
        Restaurants ({restaurants?.length ?? stats?.restaurantsCount ?? 0})
      </Text>
      <Text style={styles.hint}>
        Restaurant CRUD uses seeded data. Manage menu items under Products.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: 40 },
  greeting: { ...theme.typography.title, color: theme.colors.text },
  sub: { color: theme.colors.textMuted, marginBottom: theme.spacing.lg },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  section: {
    ...theme.typography.subtitle,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  hint: { color: theme.colors.textMuted, fontSize: 13, lineHeight: 20 },
});
