import { supabase } from '@/lib/supabase';
import { Tables } from '@/types';

export async function registerForPushNotificationsAsync() {
  console.log('Push notifications are not configured in this build.');
  return undefined;
}

const getUserToken = async (userId: string | null) => {
  if (!userId) {
    return null;
  }
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return (data as any)?.expo_push_token ?? null;
};

export const notifyUserAboutOrderUpdate = async (order: Tables<'orders'>) => {
  const token = await getUserToken(order.user_id);
  console.log('Order notification skipped:', order, token);
};
