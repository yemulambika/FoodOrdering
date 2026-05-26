import { useCart } from '@/providers/CartProvider';
import CartListItem from '@/components/CartListItem';
import Button from '@components/Button';
import EmptyState from '@/components/ui/EmptyState';
import theme from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function CartScreen() {
  const { items, total, checkout, checkingOut } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Your cart',
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
        }}
      />

      {!items.length ? (
        <EmptyState
          icon="shopping-cart"
          title="Cart is empty"
          message="Add delicious food from a restaurant menu."
          actionLabel="Find food"
          onAction={() => router.push('/(user)/home')}
        />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartListItem cartItem={item} />}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <Button
              text={checkingOut ? 'Placing order...' : 'Checkout'}
              onPress={checkout}
              loading={checkingOut}
              disabled={checkingOut}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { gap: 12, padding: theme.spacing.md, paddingBottom: 120 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadow.card,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  totalLabel: { fontSize: 16, color: theme.colors.textMuted },
  totalValue: { fontSize: 22, fontWeight: '700', color: theme.colors.primary },
});
