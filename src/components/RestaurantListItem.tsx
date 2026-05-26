import theme from '@/constants/theme';
import { Tables } from '@/types';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import RemoteImage from './RemoteImage';
import { defaultPizzaImage } from './ProductListItem';

type RestaurantListItemProps = {
  restaurant: Tables<'restaurants'>;
  adminPreview?: boolean;
};

function RestaurantCard({ restaurant }: RestaurantListItemProps) {
  return (
    <>
      <RemoteImage
        path={restaurant.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {restaurant.name}
        </Text>

        <Text style={styles.meta}>
          ★ {restaurant.rating.toFixed(1)} · $
          {restaurant.delivery_fee.toFixed(2)} delivery
        </Text>
      </View>
    </>
  );
}

const RestaurantListItem = ({
  restaurant,
  adminPreview,
}: RestaurantListItemProps) => {
  if (adminPreview) {
    return (
      <View style={styles.container}>
        <RestaurantCard restaurant={restaurant} />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() =>
        router.push(`/(user)/restaurant/${restaurant.id}`)
      }
      style={styles.container}
    >
      <RestaurantCard restaurant={restaurant} />
    </Pressable>
  );
};

export default RestaurantListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginBottom: 12,

    // safer than spreading unknown shadow objects
    ...(theme.shadow?.card ?? {}),
  },
  image: {
    width: '100%',
    height: 140,
  },
  info: {
    padding: theme.spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  meta: {
    marginTop: 4,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});