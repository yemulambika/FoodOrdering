import { useProductList } from '@/api/products';
import { useRestaurant } from '@/api/restaurants';
import ProductGrid from '@/components/ProductGrid';
import { defaultPizzaImage } from '@/components/ProductListItem';
import RemoteImage from '@/components/RemoteImage';
import LoadingState from '@/components/ui/LoadingState';
import theme from '@/constants/theme';
import { useResponsiveGrid } from '@/hooks/useResponsiveGrid';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function RestaurantScreen() {
  const { id: idString } = useLocalSearchParams();
  const restaurantId = Number(
    Array.isArray(idString) ? idString[0] : idString
  );
  const grid = useResponsiveGrid();

  const {
    data: restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useRestaurant(restaurantId);
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProductList(restaurantId);

  if (restaurantLoading || productsLoading) {
    return <LoadingState message="Loading menu..." />;
  }

  if (!Number.isFinite(restaurantId) || restaurantError || productsError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load restaurant</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: restaurant.name }} />
      <ProductGrid
        data={products ?? []}
        getDetailHref={(item) =>
          `/(user)/restaurant/${restaurantId}/${item.id}`
        }
        ListHeaderComponent={
          <View
            style={[
              styles.header,
              { maxWidth: grid.containerWidth, alignSelf: 'center', width: '100%' },
            ]}
          >
            <RemoteImage
              path={restaurant.image}
              fallback={defaultPizzaImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.meta}>
              ★ {restaurant.rating.toFixed(1)} · $
              {restaurant.delivery_fee.toFixed(2)} delivery fee
            </Text>
            <Text style={styles.menuTitle}>Menu</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No menu items for this restaurant.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: theme.colors.error, padding: theme.spacing.md },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.radius.lg,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: theme.spacing.md,
    color: theme.colors.text,
  },
  meta: {
    fontSize: 15,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: theme.spacing.lg,
    color: theme.colors.text,
  },
  empty: {
    padding: theme.spacing.md,
    color: theme.colors.textMuted,
  },
});
