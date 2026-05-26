import { useProductList } from '@/api/products';
import { useRestaurantList } from '@/api/restaurants';
import ProductListItem from '@/components/ProductListItem';
import RestaurantListItem from '@/components/RestaurantListItem';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { data: restaurants, isLoading: rLoading, error: rError } =
    useRestaurantList();
  const { data: products, isLoading: pLoading, error: pError } = useProductList();

  if (rLoading || pLoading) {
    return <LoadingState message="Finding restaurants near you..." />;
  }

  if (rError || pError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Could not load home feed</Text>
      </View>
    );
  }

  const featured = (products ?? []).slice(0, 6);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heroTitle}>What's on your mind?</Text>
      <Text style={styles.heroSub}>Order from top restaurants</Text>

      <Text style={styles.section}>Restaurants</Text>
      {(restaurants ?? []).map((restaurant) => (
        <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
      ))}

      <Text style={styles.section}>Featured</Text>
      <View style={styles.grid}>
        {featured.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            <ProductListItem
              product={item}
              detailHref={
                item.restaurant_id
                  ? `/(user)/restaurant/${item.restaurant_id}/${item.id}`
                  : undefined
              }
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: theme.colors.error },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
  },
  heroSub: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    marginTop: 4,
  },
  section: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: { width: '48%' },
});
