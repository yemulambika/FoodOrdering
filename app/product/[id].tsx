import { useProduct } from '@/api/products';
import { ActivityIndicator, Text } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function LegacyProductRoute() {
  const { id } = useLocalSearchParams();
  const productId = Number(Array.isArray(id) ? id[0] : id);
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (!product) {
    return <Text style={{ padding: 16 }}>Product not found</Text>;
  }

  const restaurantId = product.restaurant_id ?? 1;

  return (
    <Redirect href={`/(user)/restaurant/${restaurantId}/${productId}`} />
  );
}
