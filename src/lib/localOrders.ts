import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Order, OrderItem } from '@/types';

const STORAGE_KEY = '@foodordering/local_orders';

type StoredOrders = Record<string, Order[]>;

async function readAll(): Promise<StoredOrders> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredOrders;
  } catch {
    return {};
  }
}

async function writeAll(data: StoredOrders): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getLocalOrdersForUser(userId: string): Promise<Order[]> {
  const all = await readAll();
  return all[userId] ?? [];
}

export async function saveLocalOrder(
  userId: string,
  cartItems: CartItem[],
  total: number
): Promise<Order> {
  const orderId = Date.now();
  const orderItems: OrderItem[] = cartItems.map((item, index) => ({
    id: orderId * 1000 + index,
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    size: item.size,
    products: item.product,
  }));

  const order: Order = {
    id: orderId,
    created_at: new Date().toISOString(),
    total,
    user_id: userId,
    status: 'New',
    order_items: orderItems,
  };

  const all = await readAll();
  const userOrders = all[userId] ?? [];
  all[userId] = [order, ...userOrders];
  await writeAll(all);

  if (__DEV__) {
    console.log('[LocalOrders] saved order', order.id, 'for user', userId);
  }

  return order;
}

export async function getLocalOrderById(
  userId: string,
  orderId: number
): Promise<Order | null> {
  const orders = await getLocalOrdersForUser(userId);
  return orders.find((o) => o.id === orderId) ?? null;
}

/** All locally stored orders (every user) — used for admin dashboard/list. */
export async function getAllLocalOrders(): Promise<Order[]> {
  const all = await readAll();
  return Object.values(all)
    .flat()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}

export async function getLocalOrderByIdGlobal(
  orderId: number
): Promise<Order | null> {
  const all = await getAllLocalOrders();
  return all.find((o) => o.id === orderId) ?? null;
}
