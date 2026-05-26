import { useProductList } from '@/api/products';
import { useRestaurant } from '@/api/restaurants';
import { defaultPizzaImage } from '@/components/ProductListItem';
import ProductListItem from '@/components/ProductListItem';
import RemoteImage from '@/components/RemoteImage';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function RestaurantScreen() {
  const { id: idString } = useLocalSearchParams();
  const restaurantId = Number(
    Array.isArray(idString) ? idString[0] : idString
  );

  const { data: restaurant, isLoading: restaurantLoading, error: restaurantError } =
    useRestaurant(restaurantId);
  const { data: products, isLoading: productsLoading, error: productsError } =
    useProductList(restaurantId);

  if (restaurantLoading || productsLoading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (!Number.isFinite(restaurantId) || restaurantError || productsError) {
    return <Text style={{ padding: 16 }}>Failed to load restaurant</Text>;
  }

  if (!restaurant) {
    return <Text style={{ padding: 16 }}>Restaurant not found</Text>;
  }

  return (
    <FlatList
      data={products ?? []}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      contentContainerStyle={{ gap: 10, padding: 12, paddingBottom: 24 }}
      ListHeaderComponent={
        <View style={{ marginBottom: 16 }}>
          <Stack.Screen options={{ title: restaurant.name }} />
          <RemoteImage
            path={restaurant.image}
            fallback={defaultPizzaImage}
            style={{ width: '100%', height: 180, borderRadius: 16 }}
            resizeMode="cover"
          />
          <Text style={{ fontSize: 24, fontWeight: '700', marginTop: 12 }}>
            {restaurant.name}
          </Text>
          <Text style={{ fontSize: 15, color: 'gray', marginTop: 4 }}>
            ★ {restaurant.rating.toFixed(1)} · ${restaurant.delivery_fee.toFixed(2)} delivery fee
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20 }}>
            Menu
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <ProductListItem
          product={item}
          detailHref={`/(user)/restaurant/${restaurantId}/${item.id}`}
        />
      )}
      ListEmptyComponent={<Text>No menu items for this restaurant.</Text>}
    />
  );
}
