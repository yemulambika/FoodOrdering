import { useProduct } from '@/api/products';
import Button from '@/components/Button';
import { defaultPizzaImage } from '@/components/ProductListItem';
import RemoteImage from '@/components/RemoteImage';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

export default function RestaurantProductScreen() {
  const { productId: productIdParam } = useLocalSearchParams<{
    id: string;
    productId: string;
  }>();
  const productId = Number(
    Array.isArray(productIdParam) ? productIdParam[0] : productIdParam
  );

  const { data: product, error, isLoading } = useProduct(productId);
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push('/cart');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !product) {
    return <Text style={{ padding: 16 }}>Failed to fetch product</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: product.name }} />

      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>
          {product.description ?? 'Made fresh with quality ingredients.'}
        </Text>

        <Text style={styles.sectionTitle}>Select Size</Text>
        <View style={styles.sizes}>
          {sizes.map((size) => (
            <Pressable
              key={size}
              onPress={() => setSelectedSize(size)}
              style={[
                styles.size,
                { backgroundColor: selectedSize === size ? '#000' : 'white' },
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  { color: selectedSize === size ? 'white' : 'gray' },
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.price}>${product.price}</Text>
        <Button onPress={addToCart} text="Add to cart" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  image: { width: '100%', height: 300 },
  detailsContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: 'gray', lineHeight: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  size: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
});
