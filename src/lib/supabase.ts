import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// SAFE storage
const storage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return Promise.resolve(
        typeof window !== 'undefined'
          ? window.localStorage.getItem(key)
          : null
      );
    }
    return SecureStore.getItemAsync(key);
  },

  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },

  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage,
    },
    realtime: {
      enabled: false,
    },
  }
);