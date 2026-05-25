import { Database } from '@/database.types';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

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

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

const authConfig: any = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
};

if (isNative) {
  authConfig.storage = ExpoSecureStoreAdapter as any;
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables not set: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
} else {
  console.log('Supabase config found (anon key present)');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: authConfig,
  ...(isBrowser ? { realtime: { params: { eventsPerSecond: 10 } } } : {}),
});