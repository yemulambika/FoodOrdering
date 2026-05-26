import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import theme from '@/constants/theme';
import { Tables } from '../types';
import { Link, useSegments } from 'expo-router';
import RemoteImage from './RemoteImage';

export const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
  product: Tables<'products'>;
  detailHref?: string;
};

const ProductListItem = ({ product, detailHref }: ProductListItemProps) => {
  const segments = useSegments();
  const href =
    detailHref ??
    `/${segments[0]}/menu/${product.id}`;

  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: 10,
    borderRadius: theme.radius.lg,
    flex: 1,
    maxWidth: '50%',
    ...theme.shadow.card,
  },

  image: {
    width: '100%',
    aspectRatio: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});