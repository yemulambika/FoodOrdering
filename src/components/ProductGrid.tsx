import ProductListItem from '@/components/ProductListItem';
import { useResponsiveGrid } from '@/hooks/useResponsiveGrid';
import { Product } from '@/types';
import { ReactElement } from 'react';
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
} from 'react-native';

type ProductGridProps = {
  data: Product[];
  getDetailHref?: (product: Product) => string | undefined;
  ListHeaderComponent?: FlatListProps<Product>['ListHeaderComponent'];
  ListEmptyComponent?: FlatListProps<Product>['ListEmptyComponent'];
};

export default function ProductGrid({
  data,
  getDetailHref,
  ListHeaderComponent,
  ListEmptyComponent,
}: ProductGridProps) {
  const grid = useResponsiveGrid();

  return (
    <View style={styles.wrapper}>
      <FlatList
        key={`product-grid-${grid.numColumns}`}
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={grid.numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          grid.numColumns > 1
            ? [styles.row, { gap: grid.gap, marginBottom: grid.gap }]
            : undefined
        }
        contentContainerStyle={[
          styles.list,
          {
            paddingHorizontal: grid.padding,
            paddingBottom: 24,
            maxWidth: grid.containerWidth,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <View style={{ width: grid.cardWidth }}>
            <ProductListItem
              product={item}
              width={grid.cardWidth}
              titleFontSize={grid.titleFontSize}
              detailHref={getDetailHref?.(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  list: {
    flexGrow: 1,
  },
  row: {
    justifyContent: 'flex-start',
  },
});
