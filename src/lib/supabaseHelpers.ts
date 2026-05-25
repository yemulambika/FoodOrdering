import { supabase } from './supabase';

export async function insertProduct(payload: {
  name: string;
  image?: string | null;
  price: number;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert({ name: payload.name, image: payload.image, price: payload.price })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function insertOrder(payload: any) {
  const { data, error } = await supabase.from('orders').insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteOrder(id: number) {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export default { insertProduct, deleteProduct, insertOrder, deleteOrder };
