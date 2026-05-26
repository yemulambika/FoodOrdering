import {
  getAllLocalOrders,
  getLocalOrderById,
  getLocalOrderByIdGlobal,
  getLocalOrdersForUser,
} from '@/lib/localOrders';
import { supabase } from '@/lib/supabase';
import { isSupabaseMissingTableError } from '@/lib/supabaseErrors';
import { useAuth } from '@/providers/AuthProvider';
import { InsertTables, Order, UpdateTables } from '@/types';
import ordersFallback from '@assets/data/orders';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

async function fetchMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    if (isSupabaseMissingTableError(error)) {
      const local = await getLocalOrdersForUser(userId);
      if (local.length) return local;
      return ordersFallback.filter((o) => o.user_id === userId);
    }
    throw new Error(error.message);
  }

  const remote = (data ?? []) as Order[];
  const local = await getLocalOrdersForUser(userId);

  const remoteIds = new Set(remote.map((o) => o.id));
  const merged = [
    ...local.filter((o) => !remoteIds.has(o.id)),
    ...remote,
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return merged;
}

const ACTIVE_STATUSES = ['New', 'Cooking', 'Delivering'];
const ARCHIVED_STATUSES = ['Delivered'];

function mergeOrders(remote: Order[], local: Order[]): Order[] {
  const remoteIds = new Set(remote.map((o) => o.id));
  return [
    ...local.filter((o) => !remoteIds.has(o.id)),
    ...remote,
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function filterByStatus(orders: Order[], statuses: string[]) {
  return orders.filter((o) =>
    statuses.some((s) => s.toLowerCase() === (o.status ?? '').toLowerCase())
  );
}

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ARCHIVED_STATUSES : ACTIVE_STATUSES;

  return useQuery({
    queryKey: ['orders', 'admin', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false });

      let remote: Order[] = [];
      let tableMissing = false;

      if (error) {
        if (isSupabaseMissingTableError(error)) {
          tableMissing = true;
        } else {
          throw new Error(error.message);
        }
      } else {
        remote = (data ?? []) as Order[];
      }

      const local = await getAllLocalOrders();
      const merged = mergeOrders(remote, local);
      const filtered = filterByStatus(merged, statuses);

      if (!filtered.length && tableMissing) {
        return filterByStatus(ordersFallback, statuses);
      }

      return filtered;
    },
  });
};

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['orders', { userId: id }],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return [];
      return fetchMyOrders(id);
    },
  });
};

export const useOrderDetails = (id: number) => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return data as Order;
      }

      const localByUser = userId
        ? await getLocalOrderById(userId, id)
        : null;
      if (localByUser) return localByUser;

      const localGlobal = await getLocalOrderByIdGlobal(id);
      if (localGlobal) return localGlobal;

      if (error && isSupabaseMissingTableError(error)) {
        return ordersFallback.find((order) => order.id === id) ?? null;
      }

      if (error) {
        throw new Error(error.message);
      }

      return null;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async () => {
      const [ordersRes, productsRes, restaurantsRes] = await Promise.all([
        supabase.from('orders').select('id, total, status'),
        supabase.from('products').select('id'),
        supabase.from('restaurants').select('id'),
      ]);

      const remote = (ordersRes.data ?? []) as {
        id: number;
        total: number;
        status: string;
      }[];
      const local = await getAllLocalOrders();

      const remoteIds = new Set(remote.map((o) => o.id));
      const localOnly = local.filter((o) => !remoteIds.has(o.id));

      const allOrders = [
        ...remote,
        ...localOnly.map((o) => ({
          id: o.id,
          total: o.total,
          status: o.status,
        })),
      ];

      const pendingStatuses = ['new', 'cooking', 'delivering'];

      return {
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, o) => sum + (o.total ?? 0), 0),
        pendingOrders: allOrders.filter((o) =>
          pendingStatuses.includes((o.status ?? '').toLowerCase())
        ).length,
        productsCount: productsRes.data?.length ?? 0,
        restaurantsCount: restaurantsRes.data?.length ?? 0,
      };
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<'orders'>) {
      if (!userId) {
        throw new Error('You must be signed in to place an order.');
      }

      const { error, data: newOrder } = await supabase
        .from('orders')
        .insert({
          ...data,
          user_id: userId,
          status: data.status ?? 'New',
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<'orders'>;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from('orders')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['orders', id] });
      await queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
};
