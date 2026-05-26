import { Database } from '@/database.types';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isNative =
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative';
const isNode = !isBrowser && !isNative && typeof process !== 'undefined';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const authConfig: any = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

if (isNative) {
  authConfig.storage = ExpoSecureStoreAdapter as any;
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: authConfig,
    realtime: {
      ...(isNode
        ? {
            transport: require('ws'),
          }
        : {}),
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);