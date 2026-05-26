import theme from '@/constants/theme';
import { Tables } from '@/types';
import { useSegments, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
  product: Tables<'products'>;
  detailHref?: string;
  width?: number;
  titleFontSize?: number;
};

const ProductListItem = ({
  product,
  detailHref,
  width,
  titleFontSize = 16,
}: ProductListItemProps) => {
  const segments = useSegments();
  const href =
    detailHref ?? `/${segments[0]}/menu/${product.id}`;

  return (
    <Pressable
      onPress={() => router.push(href as any)}
      style={[
        styles.container,
        width != null ? { width } : undefined,
      ]}
    >
      <View style={styles.imageWrap}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text
        style={[styles.title, { fontSize: titleFontSize }]}
        numberOfLines={2}
      >
        {product.name}
      </Text>

      <Text style={styles.price}>
        ${product.price.toFixed(2)}
      </Text>
    </Pressable>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    alignItems: 'center',

    // IMPORTANT: avoid web shadow crashes if theme.shadow.card is unsafe
    ...(theme.shadow?.card ?? {}),
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    width: '100%',
    lineHeight: 20,
  },
  price: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
    marginTop: 4,
    textAlign: 'center',
  },
});