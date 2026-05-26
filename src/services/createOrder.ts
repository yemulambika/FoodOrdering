import { supabase } from '@/lib/supabase';
import { isSupabaseMissingTableError } from '@/lib/supabaseErrors';
import { saveLocalOrder } from '@/lib/localOrders';
import { CartItem, Order } from '@/types';

export type CreateOrderResult = {
  order: Order;
  storage: 'supabase' | 'local';
};

/**
 * Creates an order in Supabase when tables exist; otherwise saves locally
 * so checkout still works during setup / offline development.
 */
export async function createOrderFromCart(
  userId: string,
  cartItems: CartItem[],
  total: number
): Promise<CreateOrderResult> {
  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({ total, status: 'New', user_id: userId })
    .select()
    .single();

  if (orderError) {
    if (isSupabaseMissingTableError(orderError)) {
      if (__DEV__) {
        console.warn(
          '[Order] Supabase orders table missing — saving order locally. Run supabase/setup_database.sql in your project.'
        );
      }
      const localOrder = await saveLocalOrder(userId, cartItems, total);
      return { order: localOrder, storage: 'local' };
    }
    throw new Error(orderError.message);
  }

  const orderItemsPayload = cartItems.map((item) => ({
    order_id: orderRow.id,
    product_id: item.product_id,
    quantity: item.quantity,
    size: item.size,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsPayload);

  if (itemsError) {
    if (isSupabaseMissingTableError(itemsError)) {
      const localOrder = await saveLocalOrder(userId, cartItems, total);
      return { order: localOrder, storage: 'local' };
    }
    throw new Error(itemsError.message);
  }

  const { data: fullOrder, error: fetchError } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', orderRow.id)
    .single();

  if (fetchError || !fullOrder) {
    return {
      order: {
        ...orderRow,
        user_id: userId,
        status: orderRow.status as Order['status'],
        order_items: cartItems.map((item, index) => ({
          id: index,
          order_id: orderRow.id,
          product_id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          products: item.product,
        })),
      },
      storage: 'supabase',
    };
  }

  return { order: fullOrder as Order, storage: 'supabase' };
}
