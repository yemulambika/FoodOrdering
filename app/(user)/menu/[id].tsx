import { useProduct } from '@/api/products';
import { ActivityIndicator, Text } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';

/** Legacy route — redirects to restaurant product screen. */
export default function LegacyMenuProduct() {
  const { id: idString } = useLocalSearchParams();
  const productId = Number(Array.isArray(idString) ? idString[0] : idString);

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
