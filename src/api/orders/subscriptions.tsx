import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

/**
 * Subscribe to new orders for admin list refresh.
 * Uses a unique channel per mount and removeChannel on cleanup to avoid
 * "cannot add postgres_changes callbacks after subscribe()" in Strict Mode.
 */
export const useInsertOrderSubscription = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const channel = supabase.channel(
      `admin-orders-insert-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    channel
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin'] });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);
};

export const useUpdateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      return;
    }

    const channel = supabase.channel(
      `order-update-${id}-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    channel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders', id] });
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin'] });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [id, queryClient]);
};
