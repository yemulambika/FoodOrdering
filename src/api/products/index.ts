import { supabase } from '@/lib/supabase';
import { isSupabaseMissingTableError } from '@/lib/supabaseErrors';
import productsFallback from '@assets/data/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const filterByRestaurant = <T extends { restaurant_id?: number | null }>(
  items: T[],
  restaurantId?: number
) => {
  if (!restaurantId) return items;
  return items.filter((item) => item.restaurant_id === restaurantId);
};

export const useProductList = (restaurantId?: number) => {
  return useQuery({
    queryKey: restaurantId
      ? ['products', { restaurantId }]
      : ['products'],
    queryFn: async () => {
      let query = supabase.from('products').select('*').order('name');

      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query;

      if (error) {
        if (isSupabaseMissingTableError(error)) {
          console.warn('Supabase table `products` not found:', error.message);
          return filterByRestaurant(productsFallback, restaurantId);
        }
        throw new Error(error.message);
      }

      if (!data?.length) {
        const fallback = filterByRestaurant(productsFallback, restaurantId);
        if (fallback.length) return fallback;
        console.warn(
          'Supabase products table empty — falling back to local seeded products.'
        );
        return filterByRestaurant(productsFallback, restaurantId);
      }

      return data;
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    enabled: Number.isFinite(id),
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Supabase product query error:', error.message);
          if (isSupabaseMissingTableError(error)) {
            console.warn('Supabase table `products` not found:', error.message);
          }
        }

        if (data) {
          return data;
        }

        return productsFallback.find((product) => product.id === id) ?? null;
      } catch (err) {
        console.warn(
          'Failed to fetch product from Supabase, using local fallback:',
          err
        );
        return productsFallback.find((product) => product.id === id) ?? null;
      }
    },
  });
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {
      name: string;
      image: string | null;
      price: number;
      restaurant_id?: number;
      description?: string | null;
    }) {
      const { error, data: newProduct } = await supabase
        .from('products')
        .insert({
          name: data.name,
          image: data.image,
          price: data.price,
          restaurant_id: data.restaurant_id ?? 1,
          description: data.description ?? null,
        })
        .select()
        .single();

      if (error) {
        if (isSupabaseMissingTableError(error)) {
          console.warn('Supabase table `products` not found:', error.message);
          throw new Error(
            'Product creation is unavailable because the products table is missing.'
          );
        }
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: {
      id: number;
      name: string;
      image: string | null;
      price: number;
      description?: string | null;
    }) {
      const { error, data: updatedProduct } = await supabase
        .from('products')
        .update({
          name: data.name,
          image: data.image,
          price: data.price,
          description: data.description ?? null,
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        if (isSupabaseMissingTableError(error)) {
          console.warn('Supabase table `products` not found:', error.message);
          throw new Error(
            'Product updates are unavailable because the products table is missing.'
          );
        }
        throw new Error(error.message);
      }
      return updatedProduct;
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({
        queryKey: ['products', variables.id],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        if (isSupabaseMissingTableError(error)) {
          console.warn('Supabase table `products` not found:', error.message);
          throw new Error(
            'Product deletion is unavailable because the products table is missing.'
          );
        }
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
