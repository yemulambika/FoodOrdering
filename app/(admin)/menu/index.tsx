import { useProductList } from '@/api/products';
import ProductGrid from '@/components/ProductGrid';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { View, StyleSheet } from 'react-native';
import theme from '@/constants/theme';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <LoadingState message="Loading products..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon="exclamation-circle"
        title="Failed to load products"
        message={(error as Error).message}
      />
    );
  }

  if (!products?.length) {
    return (
      <View style={styles.empty}>
        <EmptyState
          icon="cutlery"
          title="No products"
          message="Create your first product with the + button."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ProductGrid data={products} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  empty: { flex: 1, backgroundColor: theme.colors.background },
});
