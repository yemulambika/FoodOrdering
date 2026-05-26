import { supabase } from '@/lib/supabase';
import { isSupabaseMissingTableError } from '@/lib/supabaseErrors';
import restaurantsFallback from '@assets/data/restaurants';
import { useQuery } from '@tanstack/react-query';

export const useRestaurantList = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name');

      if (error) {
        if (isSupabaseMissingTableError(error)) {
          console.warn('Supabase table `restaurants` not found:', error.message);
          return restaurantsFallback;
        }
        throw new Error(error.message);
      }

      if (!data?.length) {
        return restaurantsFallback;
      }

      return data;
    },
  });
};

export const useRestaurant = (id: number) => {
  return useQuery({
    queryKey: ['restaurants', id],
    enabled: Number.isFinite(id) && id > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        if (isSupabaseMissingTableError(error)) {
          return restaurantsFallback.find((r) => r.id === id) ?? null;
        }
        throw new Error(error.message);
      }

      if (data) {
        return data;
      }

      return restaurantsFallback.find((r) => r.id === id) ?? null;
    },
  });
};
