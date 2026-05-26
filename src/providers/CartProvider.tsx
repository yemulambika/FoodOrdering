import { useAuth } from '@/providers/AuthProvider';
import { createOrderFromCart } from '@/services/createOrder';
import { initialisePaymentSheet, openPaymentSheet } from '@/lib/stripe';
import { CartItem, Product } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import { Alert } from 'react-native';

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => Promise<void>;
  checkingOut: boolean;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: async () => {},
  checkingOut: false,
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const generateId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const addItem = (product: Product, size: CartItem['size']) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.product_id === product.id && item.size === size
      );

      if (existing) {
        return current
          .map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
          .filter((item) => item.quantity > 0);
      }

      return [
        {
          id: generateId(),
          product,
          product_id: product.id,
          size,
          quantity: 1,
        },
        ...current,
      ];
    });
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const clearCart = () => setItems([]);

  const checkout = async () => {
    if (!session?.user?.id) {
      Alert.alert('Sign in required', 'Please sign in to place an order.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart empty', 'Add items before checkout.');
      return;
    }

    const cartSnapshot = [...items];
    const orderTotal = cartSnapshot.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    setCheckingOut(true);

    try {
      await initialisePaymentSheet(Math.floor(orderTotal * 100));
      const paid = await openPaymentSheet();
      if (!paid) {
        return;
      }

      const { order, storage } = await createOrderFromCart(
        session.user.id,
        cartSnapshot,
        orderTotal
      );

      clearCart();
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });

      if (storage === 'local') {
        Alert.alert(
          'Order saved on device',
          'Database tables are not set up yet. Your order is saved locally. Run supabase/setup_database.sql in Supabase SQL Editor for cloud orders.',
          [
            {
              text: 'View order',
              onPress: () => router.push(`/(user)/orders/${order.id}`),
            },
          ]
        );
      } else {
        router.push(`/(user)/orders/${order.id}`);
      }
    } catch (err) {
      console.error('[Order] checkout failed:', err);
      Alert.alert(
        'Checkout failed',
        err instanceof Error ? err.message : 'Could not place order.'
      );
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        total,
        checkout,
        checkingOut,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
